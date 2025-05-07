// routes/candidate.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const candidateController = require("../controllers/candidateController");
const authMiddleware = require("../middleware/authMiddleware");

// Pastikan direktori upload ada
const uploadDir = path.join(__dirname, "../public/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Konfigurasi storage untuk multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  },
});

// Filter file untuk memastikan hanya gambar yang diupload
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Hanya file gambar yang diperbolehkan"), false);
  }
};

// Upload middleware untuk single file (pamflet)
const uploadSingle = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
}).single("fotoPamflet");

// Upload middleware untuk multiple files (foto ketua dan wakil)
const uploadMultiple = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
}).fields([
  { name: "fotoKetua", maxCount: 1 },
  { name: "fotoWakil", maxCount: 1 },
]);

// Middleware hanya admin
const verifyAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Hanya admin yang bisa mengakses." });
  }
  next();
};

// Middleware untuk upload yang lebih sederhana, dipilih berdasarkan header design-type
const handleUpload = (req, res, next) => {
  const designType = req.headers["design-type"];

  if (!designType) {
    return res
      .status(400)
      .json({ message: "Design type diperlukan dalam header" });
  }

  console.log("Processing design type:", designType);

  if (designType === "combined") {
    uploadSingle(req, res, (err) => {
      if (err) {
        console.error("Upload error (combined):", err);
        return res
          .status(400)
          .json({ message: "Error uploading pamflet: " + err.message });
      }
      console.log("File uploaded successfully (combined):", req.file);
      next();
    });
  } else if (designType === "separate") {
    uploadMultiple(req, res, (err) => {
      if (err) {
        console.error("Upload error (separate):", err);
        return res
          .status(400)
          .json({ message: "Error uploading photos: " + err.message });
      }
      console.log("Files uploaded successfully (separate):", req.files);
      next();
    });
  } else {
    return res.status(400).json({ message: "Design type tidak valid" });
  }
};

// CRUD kandidat
router.get("/", candidateController.getAllCandidates);

router.get("/:id", candidateController.getCandidateById);

// POST dengan handling file upload berdasarkan design type
router.post(
  "/",
  authMiddleware.verifyToken,
  verifyAdmin,
  handleUpload,
  candidateController.createCandidate
);

// PUT dengan handling file upload berdasarkan design type
router.put(
  "/:id",
  authMiddleware.verifyToken,
  verifyAdmin,
  handleUpload,
  candidateController.updateCandidate
);

router.delete(
  "/:id",
  authMiddleware.verifyToken,
  verifyAdmin,
  candidateController.deleteCandidate
);

module.exports = router;
