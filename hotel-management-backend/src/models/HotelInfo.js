const mongoose = require("mongoose");

const hotelInfoSchema = new mongoose.Schema(
  {
    name: { type: String, default: "Grand Hải Đăng Hotel" },
    address: { type: String, required: true },
    phone: { type: String },
    email: { type: String },
    location: {
      lat: { type: Number },
      lng: { type: Number },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HotelInfo", hotelInfoSchema);