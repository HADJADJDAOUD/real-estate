import dotenv from "dotenv";

import express from "express";
import mongoose from "mongoose";
dotenv.config();
const app = express();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("connected to database");
  })
  .catch((err) => console.log(err));
app.listen(3000, () => {
  console.log("server running in port 3000!!!");
});
