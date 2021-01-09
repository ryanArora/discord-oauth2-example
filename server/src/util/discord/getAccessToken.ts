import { URLSearchParams } from "url";
import axios, { AxiosError } from "axios";
import btoa from "btoa";

interface IGetAccessTokenArgs {
  code: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

interface IGetAccessTokenError {
  code: number;
  error: string;
  message: string;
}

const creds = btoa(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`);

export default function getAccessToken (args: IGetAccessTokenArgs, cb: (err: IGetAccessTokenError | null, accessToken: string | null) => void) {
  const params = new URLSearchParams();
  params.append("grant_type", "authorization_code");
  params.append("code", args.code);
  params.append("redirect_uri", "http://localhost:3000/login");

  axios
    .post("https://discordapp.com/api/oauth2/token", params, { headers: { Authorization: `Basic ${creds}` } })
    .then(({ data }) => {
      cb(null, data.access_token);
    })
    .catch((err: AxiosError) => {
      if (err.response) {
        cb({
          code: err.response.status,
          error: err.response.data.error ? err.response.data.error : "Unknown Error",
          message: err.response.data.error_description ? err.response.data.error_description : "Discord API error"
        }, null);
      } else {
        cb({
          code: 500,
          error: "Internal Server Error",
          message: "Internal server error"
        }, null)
      }
    });
}