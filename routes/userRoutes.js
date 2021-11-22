const express = require("express");
const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  getAllUsers,
  protect,
  restrictTo,
  updateMe,
  validate,
  updateUserRole,
  RequestAccountVerification,
  verifyAccount,
} = require("../controllers/userController");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgotPassword", forgotPassword);
router.post("/requestAccountVerification", RequestAccountVerification);
router.post("/updateUserRole", protect, restrictTo(["admin"]), updateUserRole);
router.patch("/resetPassword/:token", resetPassword);
router.patch("/verifyAccount/:token", verifyAccount);
router.patch("/updateMe", protect, updateMe);
router.get("/validate", protect, validate);
router.get("/", protect, restrictTo(["admin"]), getAllUsers);

module.exports = router;
