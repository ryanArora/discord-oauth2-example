if (process.env.NODE_ENV !== "production") require("dotenv").config();

import axios, { AxiosError } from "axios";
import btoa from "btoa";
import cors from "cors";
import bodyParser from "body-parser";
import express, {Request, Response} from "express";
import { URLSearchParams } from "url";

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/login/discord", (req: Request, res: Response) => {
  const code = req.body.code;

  const params = new URLSearchParams();
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", "http://localhost:3000/login");

  const creds = btoa(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`);

  if (code) {
    axios
      .post(`https://discordapp.com/api/oauth2/token`, params, { headers: { Authorization: `Basic ${creds}` }})
      .then(({ data }) => {
        res.status(200).json({
          accessToken: data.access_token
        })
      })
      .catch((err: AxiosError) => {
        if (err.response) {
          res.status(401).json({
            error: "Invalid Request",
            message: err.response.data.error_description ? err.response.data.error_description : "Discord API error"
          });
        } else {
          res.status(500).json({
            error: "Internal Server Error",
            message: "Internal server error"
          });
        }
      });
  } else {
    res.status(400).json({
      error: "Bad Request",
      message: 'Missing "code" in request'
    });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`HTTP listening on ${process.env.PORT}`);
});