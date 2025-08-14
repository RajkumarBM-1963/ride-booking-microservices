const jwt = require("jsonwebtoken");
const captainModel = require("../models/captain.Model");
const blackListTokenModel = require("../models/blackListToken.Model");

module.exports = async (req, res, next) => {
  try {
    // Extract token from cookie or Authorization header
    const token = req.cookies.captaintoken || req.headers.authorization?.split(" ")[1];
    console.log(token);
    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token" });
    }

    // Check if token is blacklisted
    const isBlackListed = await blackListTokenModel.findOne({ token });
    if (isBlackListed) {
      return res.status(401).json({ message: "Unauthorized - Token blacklisted" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Find captain
    const captain = await captainModel.findOne({ email: decoded.email });
    if (!captain) {
      return res.status(401).json({ message: "Unauthorized - captain not found" });
    }

    // Optional: Remove password
    const { password, ...captainWithoutPassword } = captain.toObject();

    // Attach captain to request
    req.captain = captainWithoutPassword;

    next(); // ✅ Call next middleware/route handler
  } catch (err) {
    console.error("Auth Middleware Error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
