const jwt = require("jsonwebtoken");
const userModel = require("../models/user.Model");
const blackListTokenModel = require("../models/blackListToken.Model");

module.exports = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    console.log(token);
    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token" });
    }

    const isBlackListed = await blackListTokenModel.findOne({ token });
    if (isBlackListed) {
      return res.status(401).json({ message: "Unauthorized - Token blacklisted" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findOne({ email: decoded.email });
    if (!user) {
      return res.status(401).json({ message: "Unauthorized - user not found" });
    }

    const { password, ...userWithoutPassword } = user.toObject();

    req.user = userWithoutPassword;

    next();
  } catch (err) {
    console.error("Auth Middleware Error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};