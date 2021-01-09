import { sign } from "jsonwebtoken";
import { IUser } from "../models/User";

export default function signAccessToken(userId: IUser["id"]) {
  return sign({ userId }, process.env.TOKEN_SECRET, { expiresIn: 604800 });
}
