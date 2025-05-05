const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const uploadExcel = require("../middleware/excelUpload");

// Middleware untuk verifikasi admin
const verifyAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Akses ditolak. Hanya admin yang diizinkan." });
  }
  next();
};

// Route untuk mendapatkan semua mahasiswa
router.get(
  "/",
  authMiddleware.verifyToken,
  verifyAdmin,
  userController.getAllUsers
);

// Route untuk mendapatkan detail mahasiswa berdasarkan ID
router.get(
  "/:id",
  authMiddleware.verifyToken,
  verifyAdmin,
  userController.getUserById
);

// Route untuk menambahkan mahasiswa baru
router.post(
  "/",
  authMiddleware.verifyToken,
  verifyAdmin,
  userController.addUser
);

// Route untuk mengimpor mahasiswa dari file Excel
router.post(
  "/import",
  authMiddleware.verifyToken,
  verifyAdmin,
  uploadExcel,
  userController.importUsers
);

// Route untuk memperbarui data mahasiswa
router.put(
  "/:id",
  authMiddleware.verifyToken,
  verifyAdmin,
  userController.updateUser
);

// Route untuk menghapus mahasiswa
router.delete(
  "/:id",
  authMiddleware.verifyToken,
  verifyAdmin,
  userController.deleteUser
);

module.exports = router;
