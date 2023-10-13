import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateToken from "../config/generateToken.js";
import { hashPassword, comparePassword } from "../helper/hashPassword.js";

export const registerController = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    req.status(400).send({
      success: false,
      message: "Please Enter all the required field",
    });
    return;
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }
  //register user password encreting and decrepting
  const hashPasswords = await hashPassword(password);

  const user = await User.create({
    name,
    email,
    password: hashPasswords,
    pic,
  });
  if (user) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).send({
      success: false,
      message: "User not found",
    });
  }
});

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).send({
        success: false,
        message: "Please enter required fields",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).send({
        success: false,
        message: "User not found, Please register",
      });
      return;
    }

    const passwordValidation = await comparePassword(password, user.password);

    if (!passwordValidation) {
      res.status(200).send({
        success: false,
        message: "Please Enter correct Password",
      });
    }
    const token = generateToken(user._id);

    res.status(201).send({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something went wrong",
    });
    console.log(error.message);
  }
};

// Finding users by using query parameters
export const usersController = async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          {
            name: { $regex: req.query.search, $options: "i" },
            email: { $regex: req.query.search, $options: "i" },
          },
        ],
      }
    : {};

  const users = await User.find(keyword).find({
    _id: { $ne: req.user._id },
  });
  res.send(users);
};
