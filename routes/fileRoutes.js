const express = require("express");
const {
  uploadFile,
  saveFile,
  getAllFiles,
  getCourseUnitFiles,
} = require("./../controllers/fileController");
const router = express.Router();
const { protect } = require("./../controllers/userController");

router.post("/upload", protect, uploadFile, saveFile);
router.get("/getAll", protect, getAllFiles);
router.get("/:id", protect, getCourseUnitFiles);

module.exports = router;
