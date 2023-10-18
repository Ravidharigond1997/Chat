import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { sendMessage, getAllMessage } from "../controller/messageController.js";

const router = express.Router();

router.post("/", protect, sendMessage);
router.get("/:chatId", protect, getAllMessage);

export default router;
