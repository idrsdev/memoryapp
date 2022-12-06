import User from "../models/userModel.js";
import Token from "../models/tokenModel.js";

import { userWithNoPassword } from "../utils/userWithoutPassword.js";
import generateToken from "../utils/generateToken.js";
import {
  emailVerificationTemplate,
  passwordResetTemplate,
  sendEmail,
} from "../utils/sendMail.js";

import crypto from "node:crypto";

const createUserService = async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("Email alread in use");
  }

  const newUser = await User.create({
    name,
    email,
    password,
  });

  const verificationToken = await Token.create({
    _userId: newUser._id,
    token: crypto.randomBytes(16).toString("hex"),
  });

  const url = `http://${req.headers.host}/api/user/verify/${newUser.email}/${verificationToken.token}`;
  const message = emailVerificationTemplate(newUser.name, url);
  const subject = "Account Verification Link";

  const response = await sendEmail(newUser.email, subject, message);
  return response;
};

const authenticateUserService = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new Error("Invalid email or password");
  }

  if (!user.isVerified) {
    res.status(403);
    throw new Error("Verify your Account.");
  }

  if (!user || !(await user.matchPassword(password))) {
    res.status(400);
    throw new Error("Invalid username or password");
  }

  return {
    statusCode: 200,
    data: {
      ...userWithNoPassword(user),
      token: generateToken(user._id),
    },
  };
};

const userVerifyService = async (req, res) => {
  const token = await Token.findOne({ token: req.params.token });

  if (!token) {
    res.status(400);
    throw new Error(
      "Your verification link may have expired. Please click on resend for verify your Email."
    );
  }

  const user = await User.findOne({
    _id: token._userId,
    email: req.params.email,
  });

  if (!user) {
    res.status(401);
    throw new Error(
      "We were unable to find a user for this verification. Please SignUp!"
    );
  }

  if (user.isVerified) {
    return {
      statusCode: 200,
      data: { message: "Already verified. Please Login" },
    };
  }

  user.isVerified = true;
  token.delete();

  return new Promise((resolve, reject) => {
    user.save(function (err) {
      if (err) {
        res.status(500);
        throw new Error(err);
      }

      resolve({
        statusCode: 200,
        data: { message: "Account verified. Please Login" },
      });
    });
  });
};

const resendAccountActivationLinkService = async (req, res) => {
  const user = await User.findOne({ email: req.body.email }).lean();

  if (!user) {
    res.status(401);
    throw new Error(
      "We were unable to find an account associated with this email. Please SignUp!"
    );
  }

  if (user.isVerified) {
    return {
      statusCode: 200,
      data: {
        message: "This account has been already verified. Please log in.",
      },
    };
  }

  await Token.deleteMany({ email: req.body.email });

  const verificationToken = await Token.create({
    _userId: user._id,
    token: crypto.randomBytes(16).toString("hex"),
  });

  const url = `http://${req.headers.host}/api/user/verify/${user.email}/${verificationToken.token}`;
  const message = emailVerificationTemplate(user.name, url);
  const subject = "Account Verification Link";

  const response = await sendEmail(user.email, subject, message);
  return response;
};

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

export {
  createUserService,
  userVerifyService,
  authenticateUserService,
  passwordResetService,
  passwordResetEmailService,
  resendAccountActivationLinkService,
};
