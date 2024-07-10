import express from "express";
import { test } from "../controller/userController.js";

const router = express.Router();

router.get("/test", (req, res) => {
  res.json({ message: "daoud" });
});

router.get("/test", test);
export default router;
