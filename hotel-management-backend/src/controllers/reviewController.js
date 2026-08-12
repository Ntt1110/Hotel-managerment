const Review = require("../models/Review");
const Booking = require("../models/Booking");

// @route POST /api/reviews   (customer danh gia sau khi da checked-out)
const createReview = async (req, res, next) => {
  try {
    const { bookingId, rating, comment } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Khong tim thay booking" });

    if (booking.customerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Khong co quyen danh gia booking nay" });
    }
    if (booking.status !== "checked-out") {
      return res.status(400).json({ message: "Chi duoc danh gia sau khi da tra phong" });
    }

    const review = await Review.create({
      customerId: req.user._id,
      roomId: booking.roomId,
      bookingId,
      rating,
      comment,
    });

    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
};

// @route GET /api/reviews/room/:roomId
const getReviewsByRoom = async (req, res, next) => {
  try {
    const reviews = await Review.find({ roomId: req.params.roomId }).populate(
      "customerId",
      "fullName avatarUrl"
    );
    res.status(200).json(reviews);
  } catch (error) {
    next(error);
  }
};

module.exports = { createReview, getReviewsByRoom };
