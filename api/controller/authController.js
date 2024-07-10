import User from "../models/userModel.js";
import bcryptjs from "bcryptjs";
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
