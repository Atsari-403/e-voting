const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const uploadExcel = require("../middleware/excelUpload");

// Middleware verifikasi admin
const verifyAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Akses ditolak. Hanya admin yang diizinkan." });
  }
  next();
};

// Route hasil voting
router.get(
  "/vote-results",
  authMiddleware.verifyToken,
  userController.getVoteResults
);

// Route vote kandidat
router.post(
  "/vote-candidate",
  authMiddleware.verifyToken,
  userController.voteCandidate
);

// Route mengimpor mahasiswa dari file Excel
router.post(
  "/import",
  authMiddleware.verifyToken,
  verifyAdmin,
  uploadExcel,
  userController.importUsers
);

// Route mendapatkan semua mahasiswa
router.get(
  "/",
  authMiddleware.verifyToken,
  verifyAdmin,
  userController.getAllUsers
);

// Route mendapatkan detail mahasiswa berdasarkan ID
router.get(
  "/:id",
  authMiddleware.verifyToken,
  verifyAdmin,
  userController.getUserById
);

// Route menambahkan mahasiswa baru
router.post(
  "/",
  authMiddleware.verifyToken,
  verifyAdmin,
  userController.addUser
);

// Route memperbarui data mahasiswa
router.put(
  "/:id",
  authMiddleware.verifyToken,
  verifyAdmin,
  userController.updateUser
);

// Route menghapus mahasiswa
router.delete(
  "/:id",
  authMiddleware.verifyToken,
  verifyAdmin,
  userController.deleteUser
);

module.exports = router;
