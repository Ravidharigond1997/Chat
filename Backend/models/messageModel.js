import mongoose from "mongoose";

const messageModel = mongoose.Schema(
  {
    sender: {
      type: mongoose.Scheme.Types.ObjectId,
      ref: "User",
    },
    content: {
      type: String,
      trim: true,
    },
    Chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
    },
  },
  {
    timeStamps: true,
  }
);

const Message = mongoose.model("Message", messageModel);

module.exports = Message;
