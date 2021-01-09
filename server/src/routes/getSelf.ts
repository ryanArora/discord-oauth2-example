import { Request, Response } from "express";
import User from "../models/User";
import getDiscordUser, { IDiscordUser } from "../util/discord/getDiscordUser";

export default async (req: Request, res: Response) => {
  const user = await User.findOne({ id: req.userId });

  if (!user) {
    res.status(500).json({
      error: "Internal server error",
      message: "Error finding user",
    });
    return;
  }

  getDiscordUser(user.discordToken, (err, discordUser: IDiscordUser) => {
    if (!err) {
      user.username = discordUser.username;
      user.avatar = discordUser.avatar;

      user.save();
    }

    res.status(200).json({
      user: {
        id: user.id,
        username: user.username,
        avatar: user.avatar,
      },
    });
  });
};
