const express = require("express");
const {
  createPayment,
  getPaymentsByBooking,
  getAllPayments,
} = require("../controllers/paymentController");
const { protect } = require("../middlewares/authMiddleware");
const { authorize } = require("../middlewares/roleMiddleware");

const router = express.Router();

router.post("/", protect, authorize("customer"), createPayment);
router.get("/booking/:bookingId", protect, getPaymentsByBooking);
router.get("/", protect, authorize("manager"), getAllPayments);

module.exports = router;
