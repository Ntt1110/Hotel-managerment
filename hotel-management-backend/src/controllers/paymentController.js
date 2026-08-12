const Payment = require("../models/Payment");
const Booking = require("../models/Booking");

// @route POST /api/payments   (customer tao thanh toan cho booking cua minh)
const createPayment = async (req, res, next) => {
  try {
    const { bookingId, method, transactionId } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Khong tim thay booking" });

    if (booking.customerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Khong co quyen thanh toan booking nay" });
    }

    const payment = await Payment.create({
      bookingId,
      amount: booking.totalPrice,
      method,
      transactionId,
      status: "paid",
      paidAt: new Date(),
    });

    res.status(201).json(payment);
  } catch (error) {
    next(error);
  }
};

// @route GET /api/payments/booking/:bookingId
const getPaymentsByBooking = async (req, res, next) => {
  try {
    const payments = await Payment.find({ bookingId: req.params.bookingId });
    res.status(200).json(payments);
  } catch (error) {
    next(error);
  }
};

// @route GET /api/payments   (manager xem tat ca thanh toan)
const getAllPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find().populate({
      path: "bookingId",
      populate: { path: "customerId", select: "fullName email" },
    });
    res.status(200).json(payments);
  } catch (error) {
    next(error);
  }
};

module.exports = { createPayment, getPaymentsByBooking, getAllPayments };
