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
  getUserDocuments,
  updateFileDetails,
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
router.get("/getAll", getAllFiles);
router.get("/updateViewCount/:id", protect, updateViewCount);
router.patch(
  "/updateFileDetails/:id",
  protect,
  restrictTo(["admin"]),
  updateFileDetails
);
router.get("/updateLikeCount/:id", protect, updateLikeCount);
router.get("/getDocumentDetails/:id", getDocumentDetails);
router.get("/getUserDocuments", protect, getUserDocuments);
router.patch(
  "/updateFileDetails/:file_id",
  protect,
  restrictTo(["admin"]),
  updateFileDetails
);

router.get("/:id", getCourseUnitFiles);

module.exports = router;
