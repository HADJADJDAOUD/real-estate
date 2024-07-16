import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRoute.js";
import userAuth from "./routes/authRoute.js";
import helmet from "helmet";
import listingRouter from "./routes/listing.route.js";
dotenv.config();

const app = express();

app.use(helmet());
app.use(express.json());
app.use(
  cors({
    origin: "*", // Replace with your frontend URL
    credentials: true,
  })
);
app.use(cookieParser());
// get information from the cookies

///DATABASE SETTINGS
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("connected to database");
  })
  .catch((err) => console.log(err));
app.listen(3000, () => {
  console.log("server running in port 3000!!!");
});
///ROUTING SETTINGS

app.use("/api/user", userRouter);
app.use("/api/auth", userAuth);
app.use("/api/listing", listingRouter);
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "internel server error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
