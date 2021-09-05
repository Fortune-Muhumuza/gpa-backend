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
} = require("../controllers/courseController");
const { protect } = require("../controllers/userController");

const router = express.Router();
console.log("reached here router");

router.post("/register", registerCourse);
router.get("/getAll", getAllCourses);
router.put("/edit/:id", editCourse);
router.get("/increaseCount/:id", updatePopularCount);
router.get("/popular", getMostPopularCourses);
router.get("/:id", getCourse);
router.get("/", getCourseByUniversityName);
router.get("/enrolled/:id", getUsersEnrolled);
router.get("/enrollUser/:id", protect, enrollUser);

module.exports = router;
