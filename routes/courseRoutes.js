const express = require("express");
const {
  registerCourse,
  getAllCourses,
  editCourse,
} = require("../controllers/courseController");

const router = express.Router();

router.post("/register", registerCourse);
router.get("/getAll", getAllCourses);
router.put("/edit/:id", editCourse);

module.exports = router;