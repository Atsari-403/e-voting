const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  const { nim, password } = req.body;

  try {
    const user = await User.findOne({ where: { nim } });
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Password salah" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Set token in HTTP-only cookie and response
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.json({
      token, // Send token in response for client storage
      role: user.role,
      user: {
        id: user.id,
        name: user.name,
        nim: user.nim,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Login gagal", error: error.message });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "name", "nim", "role"],
    });

    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

const verifyAuth = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(401).json({
        valid: false,
        message: "User tidak ditemukan",
      });
    }

    return res.json({
      valid: true,
      user: {
        id: user.id,
        nim: user.nim,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      valid: false,
      message: "Error verifying auth",
    });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.json({ message: "Logout berhasil" });
  } catch (error) {
    res.status(500).json({ message: "Logout gagal" });
  }
};

module.exports = {
  login,
  getMe,
  verifyAuth,
  logout,
};
