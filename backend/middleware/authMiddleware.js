const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

exports.verifyToken = (req, res, next) => {

  const token = req.cookies.token;

  if (!token) {
    console.log("No token found in cookies");
    return res.status(401).json({ message: "Token tidak ditemukan" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("Token verified successfully for user ID:", decoded.id);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Token verification failed:", err.message);
    return res
      .status(403)
      .json({ message: "Token tidak valid atau kadaluarsa" });
  }
};
