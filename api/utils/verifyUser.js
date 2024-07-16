import { errorHandler } from "./error.js";
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;

  console.log("this is token", token);
  if (!token) {
    return next(errorHandler(401, "Unauthorized no token"));
  }

  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(errorHandler(403, "Forbidden not the same"));
    req.user = user;
    console.log("this is user", user);
    console.log("it entered here");
    next();
  });
};
