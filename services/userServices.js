import User from "../models/userModel.js";
import Token from "../models/tokenModel.js";

import { userWithNoPassword } from "../utils/userWithoutPassword.js";
import generateToken from "../utils/generateToken.js";
import { emailVerificationTemplate, sendEmail } from "../utils/sendMail.js";

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

  const url = `http://${req.headers.host}/api/user/confirmation/${newUser.email}/${verificationToken.token}`;
  const message = emailVerificationTemplate(newUser.name, url);
  const subject = "Account Verification Link";

  const response = await sendEmail(newUser.email, subject, message);
  return response;
};

const authenticateUserService = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");

  if (!user.isVerified) {
    res.status(403);
    throw new Error("Verify your Account.");
  }

  if (!user || !(await user.matchPassword(password))) {
    res.status(400);
    throw new Error("Invalid username or password");
  }

  return {
    ...userWithNoPassword(user),
    token: generateToken(user._id),
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
    return { message: "Already verified. Please Login" };
  }

  user.isVerified = true;

  return new Promise((resolve, reject) => {
    user.save(function (err) {
      if (err) {
        res.status(500);
        throw new Error(err);
      }

      resolve({ message: "Your account has been successfully verified" });
    });
  });
};

export { createUserService, userVerifyService, authenticateUserService };
