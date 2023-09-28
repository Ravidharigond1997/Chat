import express from "express";
import {
  registerController,
  loginController,
  usersController,
} from "../controller/userController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.get("/allUsers", protect, usersController);

export default router;
