const mongoose = require("mongoose");

const roomTypeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    basePrice: { type: Number, required: true, min: 0 },
    capacity: {
      adults: { type: Number, default: 2 },
      children: { type: Number, default: 0 },
    },
    amenities: [{ type: String }],
    images: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("RoomType", roomTypeSchema);
