import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import colors from "colors";

import userRouter from "./routes/userRoutes.js";
import chatRouter from "./routes/chatRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

const app = express();

dotenv.config();

connectDB();

app.use(express.json());
app.use(express.json()); // to accept json data
app.use(cors({ origin: true }));

app.post("/data", async (req, res) => {
  const { username } = req.body;
  return res.json({ username: username, secret: "sha256.." });
});

app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`port is running on ${PORT}`.yellow.bold));
