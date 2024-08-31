const User = require("../modals/User.modal");
const crypto = require("crypto");
const ErrorResponse = require("../utils/errorResponse");
const sendEmail = require("../utils/sendEmail");

exports.register = async (req, res, next) => {
  // console.log("me register")
  // const[username , email , password] = req.body;
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  // res.send("Resgister Route ")
  try {
    const user = await User.create({
      username,
      email,
      password,
    });
    sendToken(user, 201, res);
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    return next(new ErrorResponse("please provide email and password", 400));
  }
  try {
    const user = await User.findOne({ email }).select("+password");
    // console.log("user", user)
    if (!user) {
      return next(new ErrorResponse("Invalid Credentials", 401));
    }
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return next(new ErrorResponse("Invalid Credentials", 401));
    }
    sendToken(user, 200, res);
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
};

exports.forgotPassword = async (req, res, next) => {
  const email = req.body.email;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(new ErrorResponse("Email could not be sent", 404));
    }
    const resetToken = await user.getResetPasswordToken();
    user.save(function (err, next) {
      if (err) {
        next(new ErrorResponse("Token is not saved in mongoDb", 401));
      }
    });

    const resetUrl = `http://localhost:3000/passwordreset/${resetToken}`;

    // body as per send grid message = body
    const message = `<h1>You Have Requested to change Password </h1>
        <p>Please go to this link to reset password </p>
        <a href=${resetUrl} clicktracking=off>${resetUrl} </a>`;

    // console.log("user", user);
    try {
      await sendEmail({
        to: user.email,
        subject: "Pass reset request",
        text: message,
      });
      res.status(200).json({ success: true, data: "email sent" });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save(); // this is not called

      return next(new ErrorResponse("Email could not be sent ", 500));
    }
  } catch (error) {
    next(error);
  }
};

exports.ResetPassword = async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  console.log("token", req.params.resetToken);
  try {
    const user =await  User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) {
      return next(new ErrorResponse("Invalid reset token", 400));
    }

    user.password = req.body.password;
    user.resetPasswordExpire = undefined;
    user.resetPasswordToken = undefined;

    await user.save();
    res.status(201).json({ status: true, data: "Password reset success" });
  } catch (error) {
    next(error);
  }
};

const sendToken = (user, statusCode, res) => {
  const token = user.getSignedToken();
  res.status(statusCode).json({ status: true, token: token });
};
