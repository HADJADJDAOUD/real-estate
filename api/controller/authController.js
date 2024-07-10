import User from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import errorHandler from "../utils/error.js";
/////////
///////////
//////////

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const access_token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: false,
  };
  cookieOptions.secure = true;
  // if (process.env.NODE_ENV === "production") {
  //   cookieOptions.secure = true;
  // }
  res.cookie("access_token", access_token, cookieOptions);
  console.log("cookies are stored");
  // Remove password from output
  res.status(statusCode).json({
    status: "success",
    access_token,
    data: {
      user,
    },
  });
};
///////////////
///////////////
///////////////
export const signUp = async (req, res, next) => {
  const { email, password, username } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ email, password: hashedPassword, username });
  try {
    await newUser.save();
    res.status(201).json({ message: "created" });
  } catch (error) {
    next(error);
  }
};
/////////////
///////////
////////////////
export const signIn = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(errorHandler(400, "Please provide email and password"));
  }
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(400, "user not found"));
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(401, "incorrect credential"));
    }
    //// to remove the password from get displayed
    const { password: pass, ...rest } = validUser._doc;
    createSendToken(rest, 200, res);
  } catch (error) {
    next(error);
  }
};
