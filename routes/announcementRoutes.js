const express = require("express");
const {
  getCourseUnitAnnouncement,
  createAnnouncement,
  getAnnouncements,
  getAnnouncement,
  getCourseAnnouncement,
} = require("../controllers/announcementController");
const { protect } = require("../controllers/userController");
const router = express.Router();

router.post("/createAnnouncement", protect, createAnnouncement);
router.get("/getAll", protect, getAnnouncements);
router.get("/getCourseAnnouncements/:id", protect, getCourseAnnouncement);
router.get(
  "/getCourseUnitAnnouncements/:id",
  protect,
  getCourseUnitAnnouncement
);

router.get("/:id", protect, getAnnouncement);

module.exports = router;
