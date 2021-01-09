import { Request, Response } from "express";

import User from "../models/User";

import getAccessToken from "../util/discord/getAccessToken";
import getDiscordUser, { IDiscordUser } from "../util/discord/getDiscordUser";
import signAccessToken from "../util/signAccessToken";

export default (req: Request, res: Response) => {
  const code = req.body.code;

  if (!code) {
    res.status(400).json({
      error: "Bad Request",
      message: 'Missing "code" in request',
    });
    return;
  }

  getAccessToken({ clientId: process.env.CLIENT_ID, clientSecret: process.env.CLIENT_SECRET, redirectUri: "http://localhost:3000/login", code }, (err, accessToken) => {
    if (err) {
      res.status(err.code).json({
        error: err.error,
        message: err.message,
      });
      return;
    }

    getDiscordUser(accessToken, async (err, discordUser: IDiscordUser) => {
      if (err) {
        res.status(err.code).json({
          error: err.error,
          message: err.message,
        });
        return;
      }

      let user = await User.findOne({ id: discordUser.id });

      const ts = Math.round(Date.now() / 1000);

      if (!user) {
        user = new User({
          id: discordUser.id,
          discordToken: accessToken,
          username: discordUser.username,
          avatar: discordUser.avatar,
          createdAt: ts,
        });

        user.save();
      } else if (user.username !== discordUser.username || user.avatar !== discordUser.avatar) {
        user.discordToken = accessToken;
        user.username = discordUser.username;
        user.avatar = discordUser.avatar;

        user.save();
      } else {
        user.discordToken = accessToken;

        user.save();
      }

      res.status(200).json({
        accessToken: signAccessToken(user.id),
        user: {
          id: user.id,
          username: user.username,
          avatar: user.avatar,
        },
      });
    });
  });
};
