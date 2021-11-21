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
  unregisterCourseUnit,
  getCourseUnitByCourseId,
  deactivateCourseUnit,
} = require("../controllers/courseUnitController");
const { protect, restrictTo } = require("./../controllers/userController");

const router = express.Router();

router.post("/register", registerCourseUnit);
router.get("/getAll", getAllCourseUnits);
router.get("/getCourseUnitByCourseId", getCourseUnitByCourseId);
router.put("/edit/:id", editCourseUnits);
router.get("/increaseCount/:id", updatePopularCount);
router.get("/popular", getMostPopularCourseUnits);
router.get("/:id", getCourseUnit);
router.get("/", getCourseUnitByUniNameAndCourseName);
router.get("/enrolled/:id", getUsersEnrolled);
router.get("/deregister/:id", protect, unregisterCourseUnit);
router.get("/enrollUser/:id", protect, enrollUser);
router.patch(
  "/deactivateCourseUnit/:id",
  protect,
  restrictTo(["admin"]),
  deactivateCourseUnit
);
module.exports = router;
