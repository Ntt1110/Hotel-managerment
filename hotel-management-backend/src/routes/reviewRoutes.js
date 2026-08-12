const express = require("express");
const { createReview, getReviewsByRoom } = require("../controllers/reviewController");
const { protect } = require("../middlewares/authMiddleware");
const { authorize } = require("../middlewares/roleMiddleware");

const router = express.Router();

router.post("/", protect, authorize("customer"), createReview);
router.get("/room/:roomId", getReviewsByRoom);

module.exports = router;
