const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    bookingCode: { type: String, required: true, unique: true },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    numberOfGuests: {
      adults: { type: Number, default: 1 },
      children: { type: Number, default: 0 },
    },
    services: [
      {
        serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
        quantity: { type: Number, default: 1 },
      },
    ],
    status: {
      type: String,
      enum: ["pending", "confirmed", "checked-in", "checked-out", "cancelled"],
      default: "pending",
    },
    totalPrice: { type: Number, required: true, min: 0 },
    note: { type: String, trim: true },
  },
  { timestamps: true }
);

bookingSchema.index({ customerId: 1 });
bookingSchema.index({ roomId: 1, checkInDate: 1, checkOutDate: 1 });
bookingSchema.index({ status: 1 });

module.exports = mongoose.model("Booking", bookingSchema);
