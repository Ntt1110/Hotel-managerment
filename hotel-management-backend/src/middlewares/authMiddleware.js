const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware kiem tra da dang nhap (xac thuc token) 
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Gan thong tin user vao request, khong lay password
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "Nguoi dung khong ton tai" });
      }
      if (!req.user.isActive) {
        return res.status(403).json({ message: "Tai khoan da bi khoa" });
      }

      return next();
    } catch (error) {
      return res.status(401).json({ message: "Token khong hop le hoac da het han" });
    }
  }

  return res.status(401).json({ message: "Khong tim thay token, vui long dang nhap" });
};

module.exports = { protect };
