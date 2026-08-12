// Middleware kiem tra vai tro, dung sau middleware "protect"
// Cach dung: authorize("manager")  hoac  authorize("manager", "customer")
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Chua xac thuc nguoi dung" });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Vai tro '${req.user.role}' khong co quyen truy cap chuc nang nay`,
      });
    }
    next();
  };
};

module.exports = { authorize };
