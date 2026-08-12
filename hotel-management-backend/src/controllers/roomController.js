const Room = require("../models/Room");
const RoomType = require("../models/RoomType");
const Booking = require("../models/Booking");

// @route GET /api/rooms
// @desc  Xem danh sach phong (mac dinh an phong da xoa mem)
const getRooms = async (req, res, next) => {
  try {
    const filter = { isDeleted: false };
    if (req.query.status) filter.status = req.query.status;
    if (req.query.roomTypeId) filter.roomTypeId = req.query.roomTypeId;
    // Manager co the truyen includeDeleted=true de xem ca phong da xoa
    if (req.query.includeDeleted === "true") delete filter.isDeleted;

    const rooms = await Room.find(filter).populate("roomTypeId");
    res.status(200).json(rooms);
  } catch (error) {
    next(error);
  }
};

// @route GET /api/rooms/:id
const getRoomById = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id).populate("roomTypeId");
    if (!room) return res.status(404).json({ message: "Khong tim thay phong" });
    res.status(200).json(room);
  } catch (error) {
    next(error);
  }
};

// @route GET /api/rooms/available?checkIn=...&checkOut=...
// @desc  Tim phong trong theo khoang ngay
const getAvailableRooms = async (req, res, next) => {
  try {
    const { checkIn, checkOut } = req.query;
    if (!checkIn || !checkOut) {
      return res.status(400).json({ message: "Vui long cung cap checkIn va checkOut" });
    }

    const overlappingBookings = await Booking.find({
      status: { $in: ["pending", "confirmed", "checked-in"] },
      checkInDate: { $lt: new Date(checkOut) },
      checkOutDate: { $gt: new Date(checkIn) },
    }).select("roomId");

    const bookedRoomIds = overlappingBookings.map((b) => b.roomId);

    const availableRooms = await Room.find({
      _id: { $nin: bookedRoomIds },
      status: "available",
      isDeleted: false,
    }).populate("roomTypeId");

    res.status(200).json(availableRooms);
  } catch (error) {
    next(error);
  }
};

// @route POST /api/rooms   (chi manager)
const createRoom = async (req, res, next) => {
  try {
    const { roomNumber, floor, roomTypeId, status } = req.body;

    const roomType = await RoomType.findById(roomTypeId);
    if (!roomType) return res.status(400).json({ message: "roomTypeId khong hop le" });

    const room = await Room.create({ roomNumber, floor, roomTypeId, status });
    res.status(201).json(room);
  } catch (error) {
    next(error);
  }
};

// @route PUT /api/rooms/:id   (chi manager)
const updateRoom = async (req, res, next) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!room) return res.status(404).json({ message: "Khong tim thay phong" });
    res.status(200).json(room);
  } catch (error) {
    next(error);
  }
};

// @route DELETE /api/rooms/:id   (chi manager)
// @desc  Xoa mem: khong xoa khoi database, chi danh dau isDeleted = true
const deleteRoom = async (req, res, next) => {
  try {
    const room = await Room.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );
    if (!room) return res.status(404).json({ message: "Khong tim thay phong" });
    res.status(200).json({ message: "Da xoa phong (xoa mem) thanh cong", room });
  } catch (error) {
    next(error);
  }
};

// @route PUT /api/rooms/:id/restore   (chi manager)
// @desc  Khoi phuc phong da xoa mem
const restoreRoom = async (req, res, next) => {
  try {
    const room = await Room.findByIdAndUpdate(
      req.params.id,
      { isDeleted: false, deletedAt: null },
      { new: true }
    );
    if (!room) return res.status(404).json({ message: "Khong tim thay phong" });
    res.status(200).json(room);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRooms,
  getRoomById,
  getAvailableRooms,
  createRoom,
  updateRoom,
  deleteRoom,
  restoreRoom,
};