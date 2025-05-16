const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const sequelize = require("./config/db");
const path = require("path"); // Tambahkan import path
const authRoutes = require("./routes/auth");
const User = require("./models/User");
const userRoutes = require("./routes/user");
const candidateRoutes = require("./routes/candidate");
const cookieParser = require("cookie-parser");

dotenv.config();
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // URL frontend Anda
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET)); // Tambahkan secret key jika menggunakan signed cookies

// Tambahkan middleware untuk serving static files
app.use(express.static(path.join(__dirname, "public")));
// Tambahkan route khusus untuk uploads jika diperlukan
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/candidates", candidateRoutes);

// Sync DB dan buat admin default jika belum ada
sequelize.sync({ alter: true }).then(async () => {
  // console.log("Database connected & synced");

  // const mahasiswaExists = await User.findOne({ where: { nim: "mahasiswa" } });
  // if (!mahasiswaExists) {
  //   const bcrypt = require("bcryptjs");
  //   const hashed = await bcrypt.hash("mahasiswa123", 10);
  //   await User.create({
  //     nim: "mahasiswa",
  //     name: "Mahasiswa",
  //     password: hashed,
  //     role: "mahasiswa",
  //   });
  //   console.log(
  //     "Mahasiswa default dibuat (nim: mahasiswa, password: mahasiswa123)"
  //   );
  // }

  app.listen(process.env.PORT, () =>
    console.log(`Server running on port ${process.env.PORT}`)
  );
});
