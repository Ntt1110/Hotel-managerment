const express = require("express");
const { getHotelInfo, updateHotelInfo } = require("../controllers/hotelInfoController");
const { protect } = require("../middlewares/authMiddleware");
const { authorize } = require("../middlewares/roleMiddleware");

const router = express.Router();

router.get("/", getHotelInfo);
router.put("/", protect, authorize("manager"), updateHotelInfo);

// Middleware rieng, chi bat loi phat sinh trong cac route hotel-info.
// Dat sau khi khai bao route, trong CUNG router: Express uu tien no
// truoc khi loi "roi" xuong errorHandler toan cuc trong app.js.
router.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  console.error(
    `[hotel-info] ${req.method} ${req.originalUrl} -> ${statusCode}: ${err.message}`
  );

  res.status(statusCode).json({
    message: err.message || "Da co loi xay ra voi dich vu thong tin khach san",
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
});

module.exports = router;