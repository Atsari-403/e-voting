const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  try {
    const { nim, password } = req.body;

    const user = await User.findOne({ where: { nim } });
    if (!user) {
      return res.status(401).json({ message: "NIM atau password salah" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "NIM atau password salah" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Perbaikan cookie settings
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 3600000, // 1 jam
      secure: false, // PASTIKAN false untuk development
      sameSite: "lax",
      path: "/",
      domain: undefined, // Jangan set domain secara eksplisit
    });

    res.status(200).json({
      message: "Login berhasil",
      user: {
        id: user.id,
        nim: user.nim,
        name: user.name,
        role: user.role,
        hasVoted: user.hasVoted,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Gagal melakukan login",
      error: error.message,
    });
  }
};

exports.getMe = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId, {
      attributes: ["id", "nim", "name", "role", "hasVoted"],
    });

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({
      message: "Gagal mendapatkan data user",
      error: error.message,
    });
  }
};

exports.logout = async (req, res) => {
  try {
    // Hapus cookie token
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax", // Sama dengan login
      path: "/", // Tambahkan path yang sama dengan login
    });

    return res.status(200).json({ message: "Logout berhasil" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      message: "Gagal melakukan logout",
      error: error.message,
    });
  }
};
