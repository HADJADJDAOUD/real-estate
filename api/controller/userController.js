import User from "../models/userModel.js";
import bcryptjs from "bcryptjs";

import { errorHandler } from "../utils/error.js";
import Listing from "../models/listingModel.js";

export const test = (req, res) => {
  res.json({ message: "hi daoud" });
};
export const updateUser = async (req, res, next) => {
  console.log(req.user.id);
  console.log(req.params.id);
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, "you can only update your account"));
  }
  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.params.id !== req.user.id) {
    return next(errorHandler(401, "you can delte your own account"));
  }
  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token");

    res.status(200).json("user has been deleted");
  } catch (error) {
    console.log("error in delete function", error);
  }
};

export const getUserListing = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    try {
      const listing = await Listing.find({ userRef: req.params.id });
      res.status(200).json({ dataLength: listing.length, data: listing });
    } catch (error) {}
  } else {
    return next(errorHandler(401, "you can only view your own listing"));
  }
};
