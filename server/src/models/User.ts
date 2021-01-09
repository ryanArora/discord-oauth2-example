import { Schema, Document, model } from "mongoose";

export interface IUser extends Document {
  id: string;
  discordToken: string;
  username: string;
  avatar: string;
  createdAt: number;
}

const userSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  discordToken: { type: String, required: true },
  username: { type: String, required: true },
  avatar: { type: String, required: true },
  createdAt: { type: Number, required: true },
});

export default model<IUser>("User", userSchema);
