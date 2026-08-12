const express = require("express");
const {
  getRooms,
  getRoomById,
  getAvailableRooms,
  createRoom,
  updateRoom,
  deleteRoom,
  restoreRoom,
} = require("../controllers/roomController");
const { protect } = require("../middlewares/authMiddleware");
const { authorize } = require("../middlewares/roleMiddleware");

const router = express.Router();

// Public - ai cung xem duoc danh sach phong
router.get("/", getRooms);

router.get("/available", getAvailableRooms);
router.get("/:id", getRoomById);

// Chi manager duoc quan ly phong
router.post("/", protect, authorize("manager"), createRoom);
router.put("/:id", protect, authorize("manager"), updateRoom);
router.delete("/:id", protect, authorize("manager"), deleteRoom);
router.put("/:id/restore", protect, authorize("manager"), restoreRoom);

module.exports = router;