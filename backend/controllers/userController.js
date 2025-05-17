const User = require("../models/User");
const Candidate = require("../models/Candidate");
const bcrypt = require("bcryptjs");
const { sequelize } = require("../config/db")
const { Op } = require("sequelize");
const XLSX = require("xlsx");

// Tambah mahasiswa satu per satu
exports.addUser = async (req, res) => {
  const { nim, name, password, role = "mahasiswa" } = req.body;

  try {
    // Cek apakah NIM sudah terdaftar
    const existingUser = await User.findOne({ where: { nim } });
    if (existingUser) {
      return res.status(400).json({ message: "NIM sudah terdaftar" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Buat user baru
    const newUser = await User.create({
      nim,
      name,
      password: hashedPassword,
      role,
    });

    // Hapus password dari response
    const userData = newUser.toJSON();
    delete userData.password;

    res.status(201).json({
      message: "Mahasiswa berhasil ditambahkan",
      user: userData,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Gagal menambahkan mahasiswa", error: error.message });
  }
};

// Mendapatkan semua mahasiswa
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "nim", "name", "hasVoted"],
      where: {
        role: "mahasiswa",
      },
    });

    // Log data sebelum dikirim

    // Transform data sebelum dikirim
    const transformedUsers = users.map((user) => ({
      ...user.toJSON(),
      hasVoted: Boolean(user.hasVoted),
    }));

    res.json(transformedUsers);
  } catch (error) {
    console.error("Error getting users:", error);
    res.status(500).json({ message: error.message });
  }
};

// Mendapatkan detail mahasiswa berdasarkan ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { id: req.params.id, role: "mahasiswa" },
      attributes: ["id", "nim", "name", "createdAt", "updatedAt"],
    });

    if (!user) {
      return res.status(404).json({ message: "Mahasiswa tidak ditemukan" });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Gagal mendapatkan data mahasiswa",
      error: error.message,
    });
  }
};

// Update data mahasiswa
exports.updateUser = async (req, res) => {
  const { name, password } = req.body;
  const userId = req.params.id;

  try {
    const user = await User.findOne({
      where: { id: userId, role: "mahasiswa" },
    });

    if (!user) {
      return res.status(404).json({ message: "Mahasiswa tidak ditemukan" });
    }

    // Perbarui data
    const updateData = { name };

    // Jika password diubah, hash password baru
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    await user.update(updateData);

    res.json({ message: "Data mahasiswa berhasil diperbarui" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Gagal memperbarui data mahasiswa",
      error: error.message,
    });
  }
};

// Hapus mahasiswa
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findOne({
      where: { id: userId, role: "mahasiswa" },
    });

    if (!user) {
      return res.status(404).json({ message: "Mahasiswa tidak ditemukan" });
    }

    await user.destroy();
    res.json({ message: "Mahasiswa berhasil dihapus" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Gagal menghapus mahasiswa", error: error.message });
  }
};

exports.importUsers = async (req, res) => {
  try {
    const users = req.body.users;

    if (!users || users.length === 0) {
      return res.status(400).json({
        message: "Data pengguna dari file Excel kosong atau tidak valid.",
      });
    }

    const results = [];

    for (const user of users) {
      const nim = String(user.nim).trim();
      const name = user.name?.trim();
      const password = user.password?.trim();

      if (!nim || !name || !password) {
        results.push({ nim, status: "Data tidak lengkap - dilewati" });
        continue;
      }

      const existing = await User.findOne({ where: { nim } });
      if (existing) {
        results.push({ nim, status: "Duplikat - dilewati" });
        continue;
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await User.create({
        nim,
        name,
        password: hashedPassword,
        role: "mahasiswa",
      });

      results.push({ nim, status: "Berhasil ditambahkan" });
    }

    res.json({ message: "Import selesai", results });
  } catch (error) {
    console.error("Gagal import Excel:", error);
    res
      .status(500)
      .json({ message: "Gagal import Excel", error: error.message });
  }
};

exports.voteCandidate = async (req, res) => {
  try {
    console.log("Vote request received:", {
      userId: req.user.id,
      candidateId: req.body.candidateId,
    });

    // Check user status
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    console.log("User before voting:", {
      id: user.id,
      hasVoted: user.hasVoted,
    });

    if (user.hasVoted) {
      return res.status(400).json({ message: "Anda sudah melakukan voting" });
    }

    // Get candidate
    const candidate = await Candidate.findByPk(req.body.candidateId);

    if (!candidate) {
      return res.status(404).json({ message: "Kandidat tidak ditemukan" });
    }

    console.log("Candidate before voting:", {
      id: candidate.id,
      votes: candidate.votes,
    });

    // Update votes
    candidate.votes = (candidate.votes || 0) + 1;
    await candidate.save();

    // Update user's voting status
    user.hasVoted = true;
    await user.save();

    console.log("After voting:", {
      candidateVotes: candidate.votes,
      userHasVoted: user.hasVoted,
    });

    return res.status(200).json({
      message: "Voting berhasil",
      candidate: {
        id: candidate.id,
        votes: candidate.votes,
      },
    });
  } catch (error) {
    console.error("Vote error:", error);
    return res.status(500).json({
      message: "Gagal melakukan voting",
      error: error.message,
    });
  }
};

exports.getVoteResults = async (req, res) => {
  try {
    console.log("Fetching vote results...");

    // Get voters with details
    const voters = await User.findAll({
      where: { hasVoted: true },
      attributes: ["id", "nim", "name"],
    });
    console.log("Voters who have voted:", voters);

    const totalVoters = voters.length;
    console.log("Total voters:", totalVoters);

    // Get candidates with vote counts
    const candidates = await Candidate.findAll({
      attributes: ["id", "nameKetua", "nameWakil", "votes"],
      order: [["votes", "DESC"]],
    });
    console.log("Candidates with votes:", candidates);

    const response = {
      candidates: candidates.map((c) => ({
        ...c.toJSON(),
        percentage:
          totalVoters > 0 ? ((c.votes / totalVoters) * 100).toFixed(2) : "0.00",
      })),
      totalVoters,
      lastUpdated: new Date().toISOString(),
    };

    console.log("Full response:", response);
    res.status(200).json(response);
  } catch (error) {
    console.error("Error in getVoteResults:", error);
    res.status(500).json({
      message: "Gagal mengambil hasil voting",
      error: error.message,
    });
  }
};
