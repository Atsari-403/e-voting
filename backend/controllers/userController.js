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

    // user baru
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
      message: "user berhasil ditambahkan",
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
  const { nim, name, password } = req.body;
  const userId = req.params.id;

  try {
    const user = await User.findOne({
      where: { id: userId, role: "mahasiswa" },
    });

    if (!user) {
      return res.status(404).json({ message: "Mahasiswa tidak ditemukan" });
    }

    // Cek apakah NIM sudah terdaftar untuk mahasiswa lain
    if (nim && nim !== user.nim) {
      const existingUser = await User.findOne({
        where: {
          nim,
          id: { [Op.ne]: userId }, // tidak termasuk user yang sedang diupdate
        },
      });
      if (existingUser) {
        return res
          .status(400)
          .json({ message: "NIM sudah digunakan oleh mahasiswa lain" });
      }
    }

    // Update data
    const updateData = { name };

    // tambah NIM jika ada
    if (nim) {
      updateData.nim = nim;
    }

    // Hash password if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    await user.update(updateData);

    res.json({ message: "Data user berhasil diperbarui" });
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

    // Cari user yang akan dihapus
    const user = await User.findOne({
      where: { id: userId, role: "mahasiswa" },
    });

    if (!user) {
      return res.status(404).json({ message: "Mahasiswa tidak ditemukan" });
    }

    // cegah hapus user yang sudah melakukan voting
    if (user.hasVoted) {
      return res.status(400).json({
        message:
          "Tidak dapat menghapus mahasiswa yang sudah melakukan voting",
        reason: "USER_ALREADY_VOTED",
      });
    }

    // Hapus user yang belum vote
    await user.destroy();

    res.json({
      message: "User berhasil dihapus",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      message: "Gagal menghapus user",
      error: error.message,
    });
  }
};


exports.importUsers = async (req, res) => {
  const batchSize = 50; // Proses 50 user per batch

  try {
    const users = req.body.users;

    if (!users || users.length === 0) {
      return res.status(400).json({
        message: "Data pengguna dari file Excel kosong atau tidak valid.",
      });
    }

    // Validasi awal dan cleaning data
    const validUsers = [];
    const results = [];

    console.log(`Memulai validasi untuk ${users.length} pengguna...`);

    for (const user of users) {
      const nim = String(user.nim).trim();
      const name = user.name?.trim();
      const password = user.password?.trim();

      if (!nim || !name || !password) {
        results.push({ nim, status: "Data tidak lengkap - dilewati" });
        continue;
      }

      validUsers.push({ nim, name, password });
    }

    console.log(
      `${validUsers.length} pengguna valid dari ${users.length} total`
    );

    // Cek duplikat di database sekaligus
    const existingNims = validUsers.map((user) => user.nim);
    const existingUsers = await User.findAll({
      where: { nim: { [Op.in]: existingNims } },
      attributes: ["nim"],
    });

    const existingNimSet = new Set(existingUsers.map((user) => user.nim));

    // Filter user yang belum ada di database
    const newUsers = validUsers.filter((user) => {
      if (existingNimSet.has(user.nim)) {
        results.push({ nim: user.nim, status: "Duplikat - dilewati" });
        return false;
      }
      return true;
    });

    console.log(`${newUsers.length} pengguna baru akan ditambahkan`);

    if (newUsers.length === 0) {
      return res.json({
        message: "Import selesai - tidak ada data baru yang ditambahkan",
        results,
      });
    }

    // Proses dalam batch dengan progress tracking
    const totalBatches = Math.ceil(newUsers.length / batchSize);
    let processedCount = 0;

    for (let i = 0; i < totalBatches; i++) {
      const startIndex = i * batchSize;
      const endIndex = Math.min(startIndex + batchSize, newUsers.length);
      const batch = newUsers.slice(startIndex, endIndex);

      console.log(
        `Memproses batch ${i + 1}/${totalBatches} (${batch.length} pengguna)...`
      );

      // Hash password untuk seluruh batch
      const hashedBatch = await Promise.all(
        batch.map(async (user) => ({
          nim: user.nim,
          name: user.name,
          password: await bcrypt.hash(user.password, 10),
          role: "mahasiswa",
        }))
      );

      try {
        // Bulk create untuk batch ini
        const createdUsers = await User.bulkCreate(hashedBatch, {
          ignoreDuplicates: true,
          returning: true,
        });

        // Update results
        batch.forEach((user, index) => {
          if (createdUsers[index]) {
            results.push({ nim: user.nim, status: "Berhasil ditambahkan" });
            processedCount++;
          } else {
            results.push({ nim: user.nim, status: "Gagal ditambahkan" });
          }
        });

        // Progress log
        const progress = Math.round(((i + 1) / totalBatches) * 100);
        console.log(
          `Progress: ${progress}% - ${processedCount} pengguna berhasil ditambahkan`
        );
      } catch (batchError) {
        console.error(`Error pada batch ${i + 1}:`, batchError);

        // Fallback: proses satu per satu untuk batch yang gagal
        for (const user of batch) {
          try {
            const hashedPassword = await bcrypt.hash(user.password, 10);
            await User.create({
              nim: user.nim,
              name: user.name,
              password: hashedPassword,
              role: "mahasiswa",
            });
            results.push({ nim: user.nim, status: "Berhasil ditambahkan" });
            processedCount++;
          } catch (individualError) {
            console.error(`Error untuk NIM ${user.nim}:`, individualError);
            results.push({
              nim: user.nim,
              status: "Gagal ditambahkan - " + individualError.message,
            });
          }
        }
      }

      // Small delay untuk mencegah overload database
      if (i < totalBatches - 1) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    console.log(
      `Import selesai: ${processedCount}/${newUsers.length} pengguna berhasil ditambahkan`
    );

    res.json({
      message: `Import selesai - ${processedCount} pengguna berhasil ditambahkan`,
      results,
      summary: {
        total: users.length,
        valid: validUsers.length,
        duplicates: existingUsers.length,
        added: processedCount,
        failed: newUsers.length - processedCount,
      },
    });
  } catch (error) {
    console.error("Gagal import Excel:", error);
    res.status(500).json({
      message: "Gagal import Excel",
      error: error.message,
    });
  }
};

// Versi dengan Server-Sent Events untuk real-time progress
exports.importUsersWithProgress = async (req, res) => {
  const batchSize = 50;

  // Set headers untuk Server-Sent Events
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "Access-Control-Allow-Origin": "*",
  });

  const sendProgress = (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  try {
    const users = req.body.users;

    if (!users || users.length === 0) {
      sendProgress({
        type: "error",
        message: "Data pengguna dari file Excel kosong atau tidak valid.",
      });
      return res.end();
    }

    sendProgress({
      type: "progress",
      stage: "validation",
      message: `Memvalidasi ${users.length} pengguna...`,
      progress: 0,
    });

    // Validasi data (sama seperti sebelumnya)
    const validUsers = [];
    const results = [];

    for (const user of users) {
      const nim = String(user.nim).trim();
      const name = user.name?.trim();
      const password = user.password?.trim();

      if (!nim || !name || !password) {
        results.push({ nim, status: "Data tidak lengkap - dilewati" });
        continue;
      }
      validUsers.push({ nim, name, password });
    }

    sendProgress({
      type: "progress",
      stage: "duplicate_check",
      message: `Memeriksa duplikat untuk ${validUsers.length} pengguna valid...`,
      progress: 20,
    });

    // Cek duplikat
    const existingNims = validUsers.map((user) => user.nim);
    const existingUsers = await User.findAll({
      where: { nim: { [Op.in]: existingNims } },
      attributes: ["nim"],
    });

    const existingNimSet = new Set(existingUsers.map((user) => user.nim));
    const newUsers = validUsers.filter((user) => {
      if (existingNimSet.has(user.nim)) {
        results.push({ nim: user.nim, status: "Duplikat - dilewati" });
        return false;
      }
      return true;
    });

    if (newUsers.length === 0) {
      sendProgress({
        type: "complete",
        message: "Import selesai - tidak ada data baru",
        results,
        progress: 100,
      });
      return res.end();
    }

    sendProgress({
      type: "progress",
      stage: "importing",
      message: `Mengimpor ${newUsers.length} pengguna baru...`,
      progress: 30,
    });

    // Proses batch dengan progress update
    const totalBatches = Math.ceil(newUsers.length / batchSize);
    let processedCount = 0;

    for (let i = 0; i < totalBatches; i++) {
      const startIndex = i * batchSize;
      const endIndex = Math.min(startIndex + batchSize, newUsers.length);
      const batch = newUsers.slice(startIndex, endIndex);

      // Hash passwords
      const hashedBatch = await Promise.all(
        batch.map(async (user) => ({
          nim: user.nim,
          name: user.name,
          password: await bcrypt.hash(user.password, 10),
          role: "mahasiswa",
        }))
      );

      try {
        const createdUsers = await User.bulkCreate(hashedBatch, {
          ignoreDuplicates: true,
          returning: true,
        });

        batch.forEach((user, index) => {
          if (createdUsers[index]) {
            results.push({ nim: user.nim, status: "Berhasil ditambahkan" });
            processedCount++;
          }
        });

        const progress = 30 + Math.round(((i + 1) / totalBatches) * 60);
        sendProgress({
          type: "progress",
          stage: "importing",
          message: `Batch ${
            i + 1
          }/${totalBatches} selesai - ${processedCount} pengguna ditambahkan`,
          progress,
          processed: processedCount,
          total: newUsers.length,
        });
      } catch (batchError) {
        sendProgress({
          type: "warning",
          message: `Error pada batch ${i + 1}, mencoba satu per satu...`,
        });

        // Fallback processing
        for (const user of batch) {
          try {
            const hashedPassword = await bcrypt.hash(user.password, 10);
            await User.create({
              nim: user.nim,
              name: user.name,
              password: hashedPassword,
              role: "mahasiswa",
            });
            results.push({ nim: user.nim, status: "Berhasil ditambahkan" });
            processedCount++;
          } catch (individualError) {
            results.push({
              nim: user.nim,
              status: "Gagal - " + individualError.message,
            });
          }
        }
      }

      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    sendProgress({
      type: "complete",
      message: `Import selesai - ${processedCount}/${newUsers.length} pengguna berhasil ditambahkan`,
      results,
      summary: {
        total: users.length,
        valid: validUsers.length,
        duplicates: existingUsers.length,
        added: processedCount,
        failed: newUsers.length - processedCount,
      },
      progress: 100,
    });
  } catch (error) {
    sendProgress({
      type: "error",
      message: "Gagal import Excel: " + error.message,
    });
  }

  res.end();
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
    // console.log("Fetching vote results...");

    // Get voters with details
    const voters = await User.findAll({
      where: { hasVoted: true },
      attributes: ["id", "nim", "name"],
    });
    // console.log("Voters who have voted:", voters);

    const totalVoters = voters.length;
    // console.log("Total voters:", totalVoters);

    // Get candidates with vote counts
    const candidates = await Candidate.findAll({
      attributes: ["id", "nameKetua", "nameWakil", "votes"],
      order: [["votes", "DESC"]],
    });
    // console.log("Candidates with votes:", candidates);

    const response = {
      candidates: candidates.map((c) => ({
        ...c.toJSON(),
        percentage:
          totalVoters > 0 ? ((c.votes / totalVoters) * 100).toFixed(2) : "0.00",
      })),
      totalVoters,
      lastUpdated: new Date().toISOString(),
    };

    // console.log("Full response:", response);
    res.status(200).json(response);
  } catch (error) {
    console.error("Error in getVoteResults:", error);
    res.status(500).json({
      message: "Gagal mengambil hasil voting",
      error: error.message,
    });
  }
};
