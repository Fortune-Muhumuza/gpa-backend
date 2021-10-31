const express = require("express");

const {
  uploadFile,
  saveFile,
  getAllFiles,
  getCourseUnitFiles,
  handleVideo,
  getDocumentDetails,
  updateViewCount,
  updateLikeCount,
  deleteFile,
} = require("./../controllers/fileController");
const router = express.Router();
const { protect, restrictTo } = require("./../controllers/userController");

router.post("/upload", protect, uploadFile, handleVideo, saveFile);
router.delete(
  "/delete/:id",
  protect,
  restrictTo(["admin", "lecturer"]),
  deleteFile
);
router.get("/getAll", protect, getAllFiles);
router.get("/updateViewCount/:id", protect, updateViewCount);
router.get("/updateLikeCount/:id", protect, updateLikeCount);
router.get("/getDocumentDetails/:id", protect, getDocumentDetails);

router.get("/:id", protect, getCourseUnitFiles);

module.exports = router;
