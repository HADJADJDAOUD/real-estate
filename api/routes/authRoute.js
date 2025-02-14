import express from "express";
import {
  google,
  signIn,
  signUp,
  signOut,
} from "../controller/authController.js";
const router = express.Router();

router.post("/signUp", signUp);
router.post("/signIn", signIn);
router.post("/google", google);
router.get("/signOut", signOut);
export default router;
