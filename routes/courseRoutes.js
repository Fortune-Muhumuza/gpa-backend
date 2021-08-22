const express = require("express");
const {
  registerCourse,
  getAllCourses,
  editCourse,
  getCourse,
  updatePopularCount,
  getMostPopularCourses,
  getCourseByUniversityName,
} = require("../controllers/courseController");

const router = express.Router();
console.log("reached here router");

router.post("/register", registerCourse);
router.get("/getAll", getAllCourses);
router.put("/edit/:id", editCourse);
router.get("/increaseCount/:id", updatePopularCount);
router.get("/popular", getMostPopularCourses);
router.get("/:id", getCourse);
router.get("/", getCourseByUniversityName);

module.exports = router;
