const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const authRoutes = require("./routes/authRoutes");
const roomRoutes = require("./routes/roomRoutes");
const roomTypeRoutes = require("./routes/roomTypeRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const hotelInfoRoutes = require("./routes/hotelInfoRoutes");
const { notFound, errorHandler } = require("./middlewares/errorHandler");

const app = express();

// ---- Middleware toan cuc (app.use) ----
app.use(cors());               // cho phep frontend (domain khac) goi API
app.use(express.json());       // parse JSON body tu request
app.use(express.urlencoded({ extended: true })); // parse form-urlencoded body
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));      // log request ra console khi dev
}

// ---- Route kiem tra server song ----
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Hotel Management API dang hoat dong" });
});

// ---- Gan cac route con theo tung module ----
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/room-types", roomTypeRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/hotel-info", hotelInfoRoutes);

// ---- Middleware xu ly loi (luon dat cuoi cung) ----
app.use(notFound);
app.use(errorHandler);

module.exports = app;
