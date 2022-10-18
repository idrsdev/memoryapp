import jwt from "jsonwebtoken";

const generatToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "2 days",
  });
};

export default generatToken;
