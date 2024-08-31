const express = require("express");
const router = express.Router();
const {
  register,
  login,
  ResetPassword,
  forgotPassword,
} = require("../controllers/auth");

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/forgotPassword").post(forgotPassword);
router.route("/resetPassword/:resetToken").put(ResetPassword);

module.exports = router;
