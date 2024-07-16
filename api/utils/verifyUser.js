import { errorHandler } from "./error.js";
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  console.log("ite here");
  const token = req.cookies.access_token;
  console.log(req.cookies);

  console.log(token);
  if (!token) {
    return next(errorHandler(401, "Unauthorized no token"));
  }

  console.log("token is there");
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(errorHandler(403, "Forbidden not the same"));
    req.user = user;
    console.log("this is user", user);
    console.log("it entered here");
    next();
  });
};
