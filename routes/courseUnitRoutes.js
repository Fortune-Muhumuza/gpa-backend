const express = require("express");
const {
  registerCourseUnit,
  editCourseUnits,
  getAllCourseUnits,
  getCourseUnit,
  updatePopularCount,
  getMostPopularCourseUnits,
  getCourseUnitByUniNameAndCourseName,
} = require("../controllers/courseUnitController");

const router = express.Router();

router.post("/register", registerCourseUnit);
router.get("/getAll", getAllCourseUnits);
router.put("/edit/:id", editCourseUnits);
router.get("/increaseCount/:id", updatePopularCount);
router.get("/popular", getMostPopularCourseUnits);
router.get("/:id", getCourseUnit);
router.get("/", getCourseUnitByUniNameAndCourseName);

module.exports = router;
