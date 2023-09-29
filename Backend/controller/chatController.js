import asyncHandler from "express-async-handler";
import Chat from "../models/chatModel.js";
import userModel from "../models/userModel.js";

export const createChateController = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    res.status(400).send({
      success: false,
      message: "UserId param not sent with request",
    });
  }

  let isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: req.userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await userModel.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };
  }
  try {
    const createChat = await Chat.create(chatData);

    const FullChat = await Chat.findOne({ _id: createChat._id }).populate(
      "users",
      "-password"
    );

    res.status(200).json(FullChat);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

export const getChateController = asyncHandler(async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await userModel.populate(results, {
          path: "latestMessage",
          select: "name pic email",
        });
        res.status(200).send(results);
      });
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

export const createGroupChatController = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please fill all the fields" });
  }

  var users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res
      .status(400)
      .send({ message: "More then 2 users are required to from a group chat" });
  }

  //   to push current logged user to with group users
  users.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    req.status(500);
    throw new Error(error.message);
  }
});

export const renameGropNameController = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  //   new is set to true other wise it will set old name only
  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404);
    throw new Error("Chat not Found");
  } else {
    res.json(updatedChat);
  }
});

export const addMemberController = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  let added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!added) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.status(200).json(added);
  }
});

export const removeMemberFromGroupContoller = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  let remove = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!remove) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.status(200).json(remove);
  }
});
