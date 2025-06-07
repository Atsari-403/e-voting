const multer = require("multer");
const XLSX = require("xlsx");
const path = require("path");
const fs = require("fs");

// Konfigurasi penyimpanan file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "../uploads");

    // Buat direktori jika belum ada
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// hanya terima file Excel
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = [".xlsx", ".xls"];
  const extname = path.extname(file.originalname).toLowerCase();

  if (allowedFileTypes.includes(extname)) {
    cb(null, true);
  } else {
    cb(
      new Error("Hanya file Excel (.xlsx atau .xls) yang diperbolehkan"),
      false
    );
  }
};

// Setup multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// Middleware untuk memproses file Excel
const processExcel = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ message: "File tidak ditemukan" });
  }

  try {
    // Baca file Excel
    const filePath = req.file.path;
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Konversi ke JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    // Validasi keberadaan kolom yang diperlukan
    if (jsonData.length === 0) {
      // Hapus file karena data kosong
      fs.unlinkSync(filePath);
      return res.status(400).json({ message: "File Excel tidak berisi data" });
    }

    // Ambil data pertama untuk memeriksa header
    const firstRow = jsonData[0];
    const hasNIM = "NIM" in firstRow || "nim" in firstRow;
    const hasName =
      "Nama" in firstRow || "nama" in firstRow || "name" in firstRow;
    const hasPassword = "Password" in firstRow || "password" in firstRow;

    // Validasi struktur kolom yang diperlukan
    if (!hasNIM || !hasName || !hasPassword) {
      // Hapus file jika struktur tidak sesuai
      fs.unlinkSync(filePath);
      return res.status(400).json({
        message:
          "Format file Excel tidak sesuai. Pastikan file berisi kolom: NIM, Nama, dan Password",
        missingColumns: {
          NIM: !hasNIM,
          Nama: !hasName,
          Password: !hasPassword,
        },
      });
    }

    // Validasi data dan konversi
    const users = jsonData.map((row, index) => {
      const nim = row.NIM || row.nim || "";
      const name = row.Nama || row.nama || row.name || "";
      const password = row.Password || row.password || "";

      // Validasi data yang diperlukan
      if (!nim || !name || !password) {
        throw new Error(
          `Data tidak lengkap pada baris ${
            index + 2
          }. Pastikan NIM, Nama, dan Password terisi.`
        );
      }

      return { nim, name, password };
    });

    // Hapus file setelah diproses
    fs.unlinkSync(filePath);

    // Tambahkan data ke request object
    req.body.users = users;
    next();
  } catch (error) {
    console.error("Error processing Excel file:", error);

    // Hapus file jika ada error
    if (req.file && req.file.path) {
      fs.unlinkSync(req.file.path);
    }

    return res.status(400).json({
      message: error.message || "Gagal memproses file Excel",
    });
  }
};

// Middleware untuk menangani upload dan proses Excel
const uploadExcel = [upload.single("file"), processExcel];

module.exports = uploadExcel;
