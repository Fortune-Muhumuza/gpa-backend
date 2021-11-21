const express = require("express");
const {
  registerCourse,
  getAllCourses,
  editCourse,
  getCourse,
  updatePopularCount,
  getMostPopularCourses,
  getCourseByUniversityName,
  getUsersEnrolled,
  enrollUser,
  getCoursesByUniversity_id,
  deactivateCourse,
} = require("../controllers/courseController");
const { protect, restrictTo } = require("../controllers/userController");

const router = express.Router();

router.post("/register", registerCourse);
router.get("/getAll", getAllCourses);
router.put("/edit/:id", editCourse);
router.get("/increaseCount/:id", updatePopularCount);
router.get("/popular", getMostPopularCourses);
router.get("/:id", getCourse);
router.get("/", getCourseByUniversityName);
router.get("/enrolled/:id", getUsersEnrolled);
router.get("/enrollUser/:id", protect, enrollUser);
router.get("/getCoursesByUniversity/:university_id", getCoursesByUniversity_id);
router.patch(
  "/deactivateCourse/:id",
  protect,
  restrictTo(["admin"]),
  deactivateCourse
);

module.exports = router;
