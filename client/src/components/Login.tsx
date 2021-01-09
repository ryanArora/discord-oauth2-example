import React, { Dispatch, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios, { AxiosError } from "axios";
import decode from "jwt-decode";
import { IUser } from "../models";

import { SERVER_URL } from "../constants";

interface IHomeProps {
  setUser: Dispatch<IUser | null>;
  setError: Dispatch<string | null>;
}

interface IDecodedJWT {
  userId: string;
  exp: number;
  iat: number;
}

const Home: React.FC<IHomeProps> = ({ setUser, setError }) => {
  let history = useHistory();

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");

    if (code) {
      axios
        .post(`${SERVER_URL}/login/discord`, { code }, { headers: { "Content-Type": "application/json" } })
        .then(({ data }) => {
          if (data.user) {
            setUser(data.user);
          }

          const decoded: IDecodedJWT = decode(data.accessToken);

          if (decoded.exp) {
            document.cookie = `token=${data.accessToken}; expires=${new Date(decoded.exp * 1000).toUTCString()}`;
          }

          history.replace("/profile");
        })
        .catch((err: AxiosError) => {
          if (err.response) {
            console.log("API Error", err.response.data);
          } else {
            console.log("Request Error", err.message);
          }

          setError("Error logging in with Discord, please try again later");
          history.replace("/");
        });
    } else {
      setError("Error logging in with Discord, please try again later");
      history.replace("/");
    }
  }, [setUser, setError, history]);

  return (
    <div>
      <p>loading...</p>
    </div>
  );
};

export default Home;
