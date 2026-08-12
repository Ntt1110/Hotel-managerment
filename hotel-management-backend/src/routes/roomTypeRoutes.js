const express = require("express");
const {
  getRoomTypes,
  createRoomType,
  updateRoomType,
  deleteRoomType,
} = require("../controllers/roomTypeController");
const { protect } = require("../middlewares/authMiddleware");
const { authorize } = require("../middlewares/roleMiddleware");

const router = express.Router();

router.get("/", getRoomTypes);
router.post("/", protect, authorize("manager"), createRoomType);
router.put("/:id", protect, authorize("manager"), updateRoomType);
router.delete("/:id", protect, authorize("manager"), deleteRoomType);

module.exports = router;
