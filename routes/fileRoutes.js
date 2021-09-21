const express = require("express");
const {
  uploadFile,
  saveFile,
  getAllFiles,
  getCourseUnitFiles,
  handleVideo,
} = require("./../controllers/fileController");
const router = express.Router();
const { protect } = require("./../controllers/userController");

router.post("/upload", protect, uploadFile, handleVideo, saveFile);
router.get("/getAll", protect, getAllFiles);
router.get("/:id", protect, getCourseUnitFiles);

module.exports = router;
