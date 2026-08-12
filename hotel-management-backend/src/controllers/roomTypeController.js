const RoomType = require("../models/RoomType");

const getRoomTypes = async (req, res, next) => {
  try {
    const roomTypes = await RoomType.find();
    res.status(200).json(roomTypes);
  } catch (error) {
    next(error);
  }
};

const createRoomType = async (req, res, next) => {
  try {
    const roomType = await RoomType.create(req.body);
    res.status(201).json(roomType);
  } catch (error) {
    next(error);
  }
};

const updateRoomType = async (req, res, next) => {
  try {
    const roomType = await RoomType.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!roomType) return res.status(404).json({ message: "Khong tim thay loai phong" });
    res.status(200).json(roomType);
  } catch (error) {
    next(error);
  }
};

const deleteRoomType = async (req, res, next) => {
  try {
    const roomType = await RoomType.findByIdAndDelete(req.params.id);
    if (!roomType) return res.status(404).json({ message: "Khong tim thay loai phong" });
    res.status(200).json({ message: "Da xoa loai phong thanh cong" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getRoomTypes, createRoomType, updateRoomType, deleteRoomType };
