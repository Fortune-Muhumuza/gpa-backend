const express = require("express");
const {
  registerUniversity,
  getAllUniversities,
  editUniversities,
  getUniversity,
  updatePopularCount,
  getMostPopularUniversities,
  getUniversityByName,
} = require("../controllers/universityController");

const router = express.Router();

router.post("/register", registerUniversity);
router.get("/getAll", getAllUniversities);


router.put("/edit/:id", editUniversities);

router.get("/increaseCount/:id", updatePopularCount);
router.get("/popular", getMostPopularUniversities);
router.get("/:id", getUniversity);
router.get("/", getUniversityByName);
module.exports = router;
 