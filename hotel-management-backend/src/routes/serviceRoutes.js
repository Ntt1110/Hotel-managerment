const express = require("express");
const {
  getServices,
  createService,
  updateService,
  deleteService,
} = require("../controllers/serviceController");
const { protect } = require("../middlewares/authMiddleware");
const { authorize } = require("../middlewares/roleMiddleware");

const router = express.Router();

router.get("/", getServices);
router.post("/", protect, authorize("manager"), createService);
router.put("/:id", protect, authorize("manager"), updateService);
router.delete("/:id", protect, authorize("manager"), deleteService);

module.exports = router;
