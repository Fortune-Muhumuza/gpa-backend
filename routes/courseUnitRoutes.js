const express = require("express");
const {
  registerCourseUnit,
  editCourseUnits,
  getAllCourseUnits,
  getCourseUnit,
  updatePopularCount,
  getMostPopularCourseUnits,
  getCourseUnitByUniNameAndCourseName,
  getUsersEnrolled,
  enrollUser,
} = require("../controllers/courseUnitController");
const { protect } = require("./../controllers/userController");

const router = express.Router();

router.post("/register", registerCourseUnit);
router.get("/getAll", getAllCourseUnits);
router.put("/edit/:id", editCourseUnits);
router.get("/increaseCount/:id", updatePopularCount);
router.get("/popular", getMostPopularCourseUnits);
router.get("/:id", getCourseUnit);
router.get("/", getCourseUnitByUniNameAndCourseName);
router.get("/enrolled/:id", getUsersEnrolled);
router.get("/enrollUser/:id", protect, enrollUser);

module.exports = router;
