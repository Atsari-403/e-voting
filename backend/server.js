const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const sequelize = require("./config/db");
const path = require("path"); // import path
const authRoutes = require("./routes/auth");
// const User = require("./models/User");
// const Candidate = require("./models/Candidate");
const userRoutes = require("./routes/user");
const candidateRoutes = require("./routes/candidate");
const cookieParser = require("cookie-parser");

dotenv.config();
const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Design-Type",
      "Authorization",
      "cache-control",
      "Accept",
      "Origin",
      "X-Requested-With",
    ],
  })
);

app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

// middleware untuk serving static files
app.use(express.static(path.join(__dirname, "public")));
// route khusus untuk uploads jika diperlukan
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// sebelum routes
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/candidates", candidateRoutes);

// Sync DB dan admin default
sequelize.sync({ alter: true }).then(async () => {
  // console.log("Database connected & synced");

  // const adminExists = await User.findOne({ where: { nim: "admin2" } });
  // if (!adminExists) {
  //   const bcrypt = require("bcryptjs")
  //   const hashed = await bcrypt.hash("adminadmin", 10);
  //   await User.create({
  //     nim: "admin2",
  //     name: "joko",
  //     password: hashed,
  //     role: "admin",
  //   });
  //   console.log(
  //     "Admin default dibuat (nim: admin2, password: admin456)"
  //   );
  // }

  // add mahasiswa default
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
