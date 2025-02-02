import User from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";

/////////
///////////
//////////
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  console.log("inside sendtoken user id ", user._id);
  const access_token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: false, // Allow client-side JavaScript access
    secure: true, // Only send cookie over HTTPS
  };

  res.cookie("access_token", access_token, cookieOptions);
  console.log("access_token cookie:", access_token);

  // Remove sensitive information before sending response

  res.status(statusCode).json({
    status: "success",
    access_token,
    data: {
      user: user, // Send sanitized user data
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
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = validUser._doc;
    console.log(req.cookies.access_token);
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      console.log("the user exists with google");
      console.log("this is user id ", user._id);

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc;
      console.log(req.cookies);
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    } else {
      console.log("the user dosent exist with google");
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-4);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

      const newUser = new User({
        username:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });

      await newUser.save();

      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = newUser._doc;
      console.log(req.cookies.access_token);
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    console.error("Error in Google OAuth:", error);
    // Handle errors properly, e.g., send an error response
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
export const signOut = async (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json("user-has-been-sign-out");
  } catch (error) {
    next(error);
  }
};

