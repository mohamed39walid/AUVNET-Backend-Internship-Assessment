const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired token." });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user?.type === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Admin access only." });
  }
};

const isAdminorUser = (req, res, next) => {
  const requestedUserId = parseInt(req.params.id, 10);
  if (req.user?.type === "admin" || req.user?.id === requestedUserId) {
    next();
  } else {
    res.status(403).json({ message: "Forbidden: not owner or admin." });
  }
};




module.exports = {
    verifyToken,
    isAdmin,
    isAdminorUser,
};