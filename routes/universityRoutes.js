const express = require("express");
const {
  registerUniversity,
  getAllUniversities,
  editUniversities,
} = require("../controllers/universityController");

const router = express.Router();

router.post("/register", registerUniversity);
router.get("/getAll", getAllUniversities);
router.put("/edit/:id", editUniversities);

module.exports = router;
