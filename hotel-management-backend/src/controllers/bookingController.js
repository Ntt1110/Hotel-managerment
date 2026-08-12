const Booking = require("../models/Booking");
const Room = require("../models/Room");
const RoomType = require("../models/RoomType");
const Service = require("../models/Service");

const generateBookingCode = () => {
  const date = new Date();
  const ymd = date.toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.floor(1000 + Math.random() * 9000);
  return `BK${ymd}${random}`;
};

const createBooking = async (req, res, next) => {
  try {
    const { roomId, checkInDate, checkOutDate, numberOfGuests, services, note } = req.body;

    if (!roomId || !checkInDate || !checkOutDate) {
      return res.status(400).json({ message: "Thieu thong tin bat buoc" });
    }
    if (new Date(checkInDate) >= new Date(checkOutDate)) {
      return res.status(400).json({ message: "Ngay check-out phai sau ngay check-in" });
    }

    const room = await Room.findById(roomId).populate("roomTypeId");
    if (!room) return res.status(404).json({ message: "Khong tim thay phong" });

    const overlap = await Booking.findOne({
      roomId,
      status: { $in: ["pending", "confirmed", "checked-in"] },
      checkInDate: { $lt: new Date(checkOutDate) },
      checkOutDate: { $gt: new Date(checkInDate) },
    });
    if (overlap) {
      return res.status(400).json({ message: "Phong da duoc dat trong khoang thoi gian nay" });
    }

    const nights = Math.ceil(
      (new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24)
    );
    let totalPrice = room.roomTypeId.basePrice * nights;

    if (services && services.length > 0) {
      for (const item of services) {
        const service = await Service.findById(item.serviceId);
        if (service) {
          totalPrice += service.price * (item.quantity || 1);
        }
      }
    }

    const booking = await Booking.create({
      bookingCode: generateBookingCode(),
      customerId: req.user._id,
      roomId,
      checkInDate,
      checkOutDate,
      numberOfGuests,
      services,
      totalPrice,
      note,
      status: "pending",
    });

    res.status(201).json(booking);
  } catch (error) {
    next(error);
  }
};

const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ customerId: req.user._id })
      .populate({ path: "roomId", populate: { path: "roomTypeId" } })
      .sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    next(error);
  }
};

const getAllBookings = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const bookings = await Booking.find(filter)
      .populate("customerId", "fullName email phone")
      .populate({ path: "roomId", populate: { path: "roomTypeId" } })
      .sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    next(error);
  }
};

const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("customerId", "fullName email phone")
      .populate({ path: "roomId", populate: { path: "roomTypeId" } });

    if (!booking) return res.status(404).json({ message: "Khong tim thay booking" });

    if (
      req.user.role === "customer" &&
      booking.customerId._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Khong co quyen xem booking nay" });
    }

    res.status(200).json(booking);
  } catch (error) {
    next(error);
  }
};

const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ["pending", "confirmed", "checked-in", "checked-out", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Trang thai khong hop le" });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!booking) return res.status(404).json({ message: "Khong tim thay booking" });

    if (status === "checked-in") {
      await Room.findByIdAndUpdate(booking.roomId, { status: "occupied" });
    }
    if (status === "checked-out" || status === "cancelled") {
      await Room.findByIdAndUpdate(booking.roomId, { status: "available" });
    }

    res.status(200).json(booking);
  } catch (error) {
    next(error);
  }
};

const cancelMyBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Khong tim thay booking" });

    if (booking.customerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Khong co quyen huy booking nay" });
    }
    if (["checked-in", "checked-out"].includes(booking.status)) {
      return res.status(400).json({ message: "Khong the huy booking da nhan/tra phong" });
    }

    booking.status = "cancelled";
    await booking.save();
    res.status(200).json(booking);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  cancelMyBooking,
};