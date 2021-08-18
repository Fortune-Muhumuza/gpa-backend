const User = require("./../models/user");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/error");
const catchAsync = require("../utils/catchAsync");
const Email = require("../utils/email");
const crypto = require("crypto");
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = async (user, statusCode, res) => {
  const token = signToken(user._id);

  const expirationtime = new Date(
    Date.now() + process.env.JWT_EXPIRES_IN_HOURS * 60 * 60 * 1000
  );
  const expiresIn = process.env.JWT_EXPIRES_IN_HOURS * 60 * 60 * 1000;

  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    expiresIn,
    expirationtime,
    user,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const existingUser = await User.findOne({ email: req.body.email });
  if (existingUser) return next(new AppError("Email already in use", 400));
  const newUser = await User.create(req.body);
  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }
  const user = await User.findOne({ email: email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password)))
    return next(new AppError("invalid credentials", 400));
  createSendToken(user, 200, res);
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("There is no user with email address.", 404));
  }


  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });



  try {
    console.log("user is", user);

    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/users/resetPassword/${resetToken}`;
    const subject = "Reset Password";
    const message = "Request for password reset";
    const html_message =
      "<h3>Dear " +
      user.first_name +
      ",</h3> <p style='color: #494949;'>You have requested to reset your password <b>" +
      "</p><h4 style='margin-bottom: 0px; margin-top: 20px;'>please click on this link to reset you password or ignore this email if you didnt request for it </h4><p style='margin-top: 3px; color: #494949;'>" +
      `<a href="${resetURL}">` +
      "Click here" +
      "</a>";
    ("</p>");
    await new Email(user.email, subject, message, html_message).sendEmail();
 
    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError("There was an error sending the email. Try again later!"),
      500
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });


  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }
  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  createSendToken(user, 200, res);
});
