const Candidate = require("../models/Candidate");
const fs = require("fs");
const path = require("path");

// Debug helper
const logRequestInfo = (req, message) => {
  console.log(`=== ${message} ===`);
  console.log("Direktori saat ini:", __dirname);
  console.log("Request body:", req.body);
  console.log("Request file:", req.file);
};

exports.getAllCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.findAll();
    res.status(200).json(candidates);
  } catch (error) {
    console.error("Error saat mengambil kandidat:", error);
    res
      .status(500)
      .json({
        message: "Terjadi kesalahan mengambil data kandidat",
        error: error.message,
      });
  }
};

exports.getCandidateById = async (req, res) => {
  try {
    const candidate = await Candidate.findByPk(req.params.id);
    if (!candidate) {
      return res.status(404).json({ message: "Kandidat tidak ditemukan" });
    }
    res.status(200).json(candidate);
  } catch (error) {
    console.error("Error saat mengambil kandidat:", error);
    res
      .status(500)
      .json({
        message: "Terjadi kesalahan mengambil data kandidat",
        error: error.message,
      });
  }
};

exports.createCandidate = async (req, res) => {
  try {
    logRequestInfo(req, "CREATE CANDIDATE");

    const { nameKetua, nameWakil, visi, misi, designType } = req.body;
    let photoData = {};

    // Validasi data wajib
    if (!nameKetua || !nameWakil || !visi || !misi || !designType) {
      return res.status(400).json({ message: "Semua field wajib diisi" });
    }

    // Handle foto berdasarkan designType
    if (designType === 'combined') {
      if (req.file) {
        photoData.fotoPamflet = "/uploads/" + req.file.filename;
        console.log("File pamflet disimpan:", req.file.path);
      }
    } else if (designType === 'separate') {
      if (req.files) {
        if (req.files.fotoKetua) {
          photoData.fotoKetua = "/uploads/" + req.files.fotoKetua[0].filename;
          console.log("File foto ketua disimpan:", req.files.fotoKetua[0].path);
        }
        if (req.files.fotoWakil) {
          photoData.fotoWakil = "/uploads/" + req.files.fotoWakil[0].filename;
          console.log("File foto wakil disimpan:", req.files.fotoWakil[0].path);
        }
      }
    }

    // Buat kandidat baru
    const newCandidate = await Candidate.create({
      nameKetua,
      nameWakil,
      visi,
      misi,
      designType,
      ...photoData
    });

    res.status(201).json({
      message: "Kandidat berhasil dibuat",
      candidate: newCandidate,
    });
  } catch (error) {
    console.error("Error saat membuat kandidat:", error);
    res.status(500).json({
      message: "Terjadi kesalahan membuat kandidat",
      error: error.message,
    });
  }
};

exports.updateCandidate = async (req, res) => {
  try {
    logRequestInfo(req, "UPDATE CANDIDATE");

    const candidate = await Candidate.findByPk(req.params.id);
    if (!candidate) {
      return res.status(404).json({ message: "Kandidat tidak ditemukan" });
    }

    const { nameKetua, nameWakil, visi, misi, designType } = req.body;
    let updateData = {};

    // Handle foto berdasarkan designType
    if (designType) {
      updateData.designType = designType;
      
      if (designType === 'combined') {
        if (req.file) {
          // Hapus file lama jika ada
          if (candidate.fotoPamflet) {
            const oldFilePath = path.join(__dirname, "../public", candidate.fotoPamflet);
            if (fs.existsSync(oldFilePath)) {
              fs.unlinkSync(oldFilePath);
              console.log("File pamflet lama dihapus:", oldFilePath);
            }
          }
          updateData.fotoPamflet = "/uploads/" + req.file.filename;
          // Reset foto terpisah
          updateData.fotoKetua = null;
          updateData.fotoWakil = null;
        }
      } else if (designType === 'separate') {
        if (req.files) {
          // Hapus file pamflet lama jika ada
          if (candidate.fotoPamflet) {
            const oldPamfletPath = path.join(__dirname, "../public", candidate.fotoPamflet);
            if (fs.existsSync(oldPamfletPath)) {
              fs.unlinkSync(oldPamfletPath);
              console.log("File pamflet lama dihapus:", oldPamfletPath);
            }
            updateData.fotoPamflet = null;
          }

          if (req.files.fotoKetua) {
            if (candidate.fotoKetua) {
              const oldKetuaPath = path.join(__dirname, "../public", candidate.fotoKetua);
              if (fs.existsSync(oldKetuaPath)) {
                fs.unlinkSync(oldKetuaPath);
              }
            }
            updateData.fotoKetua = "/uploads/" + req.files.fotoKetua[0].filename;
          }

          if (req.files.fotoWakil) {
            if (candidate.fotoWakil) {
              const oldWakilPath = path.join(__dirname, "../public", candidate.fotoWakil);
              if (fs.existsSync(oldWakilPath)) {
                fs.unlinkSync(oldWakilPath);
              }
            }
            updateData.fotoWakil = "/uploads/" + req.files.fotoWakil[0].filename;
          }
        }
      }
    }

    // Update kandidat
    await candidate.update({
      nameKetua: nameKetua || candidate.nameKetua,
      nameWakil: nameWakil || candidate.nameWakil,
      visi: visi || candidate.visi,
      misi: misi || candidate.misi,
      ...updateData
    });

    res.status(200).json({
      message: "Kandidat berhasil diupdate",
      candidate: candidate,
    });
  } catch (error) {
    console.error("Error saat mengupdate kandidat:", error);
    res.status(500).json({
      message: "Terjadi kesalahan mengupdate kandidat",
      error: error.message,
    });
  }
};

exports.deleteCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findByPk(req.params.id);
    if (!candidate) {
      return res.status(404).json({ message: "Kandidat tidak ditemukan" });
    }

    // Hapus file foto jika ada
    if (candidate.fotoPamflet) {
      const filePath = path.join(__dirname, "../public", candidate.fotoPamflet);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log("File dihapus:", filePath);
      }
    }

    await candidate.destroy();
    res.status(200).json({ message: "Kandidat berhasil dihapus" });
  } catch (error) {
    console.error("Error saat menghapus kandidat:", error);
    res
      .status(500)
      .json({
        message: "Terjadi kesalahan menghapus kandidat",
        error: error.message,
      });
  }
};
