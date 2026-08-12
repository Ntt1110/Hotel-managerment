const express = require("express");
const {
  createBooking,
  getMyBookings,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  cancelMyBooking,
} = require("../controllers/bookingController");
const { protect } = require("../middlewares/authMiddleware");
const { authorize } = require("../middlewares/roleMiddleware");

const router = express.Router();

// Customer
router.post("/", protect, authorize("customer"), createBooking);
router.get("/my", protect, authorize("customer"), getMyBookings);
router.put("/:id/cancel", protect, authorize("customer"), cancelMyBooking);

// Manager
router.get("/", protect, authorize("manager"), getAllBookings);
router.put("/:id/status", protect, authorize("manager"), updateBookingStatus);

// Dung chung (co kiem tra quyen trong controller)
router.get("/:id", protect, getBookingById);

module.exports = router;
