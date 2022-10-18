import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

const isAuthenticated = asyncHandler(async (req, res, next) => {
  const hasAuthHeader =
    req.headers.authorization && req.headers.authorization.startsWith("Bearer");

  if (!hasAuthHeader) {
    throw new Error("Not authorized, no token");
  }

  try {
    const token = req.headers.authorization.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(401);
    throw new Error("Not authorized, token failed");
  }
});

export { isAuthenticated };
