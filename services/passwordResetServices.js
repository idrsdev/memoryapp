import User from "../models/userModel.js";
import Token from "../models/tokenModel.js";

import { passwordResetTemplate, sendEmail } from "../utils/sendMail.js";

import crypto from "node:crypto";

const passwordResetEmailService = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    res.status(400);
    throw new Error(
      "We were unable to find an account associated with this email. Please SignUp!"
    );
  }

  const passwordResetToken = await Token.create({
    _userId: user._id,
    token: crypto.randomBytes(16).toString("hex"),
  });

  const url = `http://${req.headers.host}/api/user/password-reset/${user._id}/${passwordResetToken.token}`;
  const message = passwordResetTemplate(user.name, url);
  const subject = "Password Reset Link";

  const response = await sendEmail(user.email, subject, message);
  return response;
};

const passwordResetService = async (req, res) => {
  const user = await User.findById(req.params.userId);

  if (!user) {
    res.status(401);
    throw new Error("invalid or expired link");
  }

  const token = await Token.findOne({
    _userId: user._id,
    token: req.params.token,
  });

  if (!token) {
    res.status(400);
    throw new Error("Invalid link or expired");
  }

  if (req.body.password) {
    user.password = req.body.password;
  }

  await user.save();
  await token.delete();
  return {
    statusCode: 200,
    data: {
      message: "Password Reset Successfully",
    },
  };
};

export { passwordResetService, passwordResetEmailService };
