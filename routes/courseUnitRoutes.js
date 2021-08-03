const express = require("express");
const {
  registerCourseUnit,
  editCourseUnits,
  getAllCourseUnits,
} = require("../controllers/courseUnitController");

const router = express.Router();

router.post("/register", registerCourseUnit);
router.get("/getAll", getAllCourseUnits);
router.put("/edit/:id", editCourseUnits);

module.exports = router;
