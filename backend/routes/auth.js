const express = require("express");
const router = express.Router();
const {
  login,
  getMe,
  verifyAuth,
  logout,
} = require("../controllers/authController");
const { verifyToken } = require("../middleware/authMiddleware");

// Public routes
router.post("/login", login);
router.post("/logout", logout);

// Protected routes
router.get("/me", verifyToken, getMe);
router.get("/verify", verifyToken, verifyAuth);

module.exports = router;
