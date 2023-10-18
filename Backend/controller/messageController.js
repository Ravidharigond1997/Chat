import asyncHandler from "express-async-handler";
import Message from "../models/messageModel.js";
import userModel from "../models/userModel.js";
import Chat from "../models/chatModel.js";

export const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    return res.status(400).send({
      message: "Please enter required field",
    });
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    var message = await Message.create(newMessage);

    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await userModel.populate(message, {
      path: "Chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

export const getAllMessage = asyncHandler(async (req, res) => {
  try {
    const message = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");

    res.json(message);
  } catch (error) {
    res.status(500).send({
      message: "Chats are not getting",
    });
  }
});
