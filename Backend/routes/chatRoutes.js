import express from "express";
import {
  createChateController,
  getChateController,
  createGroupChatController,
  renameGropNameController,
  addMemberController,
  removeMemberFromGroupContoller,
} from "../controller/chatController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/createChat", protect, createChateController);
router.get("/getChat", protect, getChateController);
router.post("/creteGroupChat", protect, createGroupChatController);
router.put("/renameGroup", protect, renameGropNameController);
router.put("/addMember", protect, addMemberController);
router.put("/removeMemeberFromGroup", protect, removeMemberFromGroupContoller);

export default router;
