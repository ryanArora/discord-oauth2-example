if (process.env.NODE_ENV !== "production") require("dotenv").config();

import fs from "fs";
import path from "path";
import cors from "cors";
import bodyParser from "body-parser";
import express from "express";
import mongoose, { model } from "mongoose";
import morgan from "morgan";

import authenticateToken from "./middleware/authenticateToken";

import loginWithDiscord from "./routes/loginWithDiscord";
import getSelf from "./routes/getSelf";

mongoose.connect(`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}/${process.env.MONGO_DBNAME}?retryWrites=true&w=majority`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());

app.use(morgan("dev"));
app.use(morgan("combined", { stream: fs.createWriteStream(path.join(__dirname, "access.log"), { flags: "a" }) }));

app.post("/login/discord", loginWithDiscord);
app.get("/profile", authenticateToken, getSelf);

app.listen(process.env.PORT, () => {
  console.log(`HTTP listening on ${process.env.PORT}`);
});
