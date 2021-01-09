import axios, { AxiosError } from "axios";

export interface IDiscordUser {
  id: string;
  username: string;
  discriminator: string;
  avatar: string;
  bot?: boolean;
  system?: boolean;
  mfa_enabled?: boolean;
  locale?: string;
  flags?: string;
  premium_type?: number;
  public_flags?: number;
}

interface IGetDiscordUserError {
  code: number;
  error: string;
  message: string;
}

export default function getDiscordUser(accessToken: string, cb: (err: IGetDiscordUserError | null, user: IDiscordUser | null) => void) {
  axios
    .get("https://discord.com/api/users/@me", { headers: { Authorization: `Bearer ${accessToken}` } })
    .then(({ data }) => {
      cb(null, data);
    })
    .catch((err: AxiosError) => {
      if (err.response) {
        cb(
          {
            code: err.response.status,
            error: err.response.data.error ? err.response.data.error : "Unknown Error",
            message: err.response.data.error_description ? err.response.data.error_description : "Discord API error",
          },
          null
        );
      } else {
        cb(
          {
            code: 500,
            error: "Internal Server Error",
            message: "Internal server error",
          },
          null
        );
      }
    });
}
