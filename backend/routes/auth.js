const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { verifyToken } = require("../middleware/authMiddleware");

router.post("/login", authController.login);
router.get("/me", verifyToken, authController.getMe);
router.post("/logout", authController.logout);

module.exports = router;
    