import express from "express";
// import {
//   registerController,
//   loginController,
//   usersController,
// } from "../controller/userController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

// router.post("/createChat", protect, createChateController);
// router.get("/getChat", protect, getChateController);
// router.post("/creteGroupChat", protect, createGroupChatController);
// router.put("/renameGroup", protect, renameGropNameController);
// router.put("/removeMemeberFromGroup", protect , removeMemberFromGroupContoller);
// router.put("/addMember", protect, addMemberController);

export default router;
