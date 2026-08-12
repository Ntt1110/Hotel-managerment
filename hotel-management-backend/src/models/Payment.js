const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    amount: { type: Number, required: true, min: 0 },
    method: {
      type: String,
      enum: ["credit_card", "cash", "bank_transfer", "e_wallet"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "paid", "refunded", "failed"],
      default: "pending",
    },
    transactionId: { type: String },
    paidAt: { type: Date },
  },
  { timestamps: true }
);

paymentSchema.index({ bookingId: 1 });

module.exports = mongoose.model("Payment", paymentSchema);
