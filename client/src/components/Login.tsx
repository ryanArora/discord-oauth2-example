import React, { Dispatch, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios, { AxiosError } from "axios";

import { SERVER_URL } from "../constants";

interface IHomeProps {
  setAccessToken: Dispatch<string | null>
  setError: Dispatch<string | null>
}

const Home: React.FC<IHomeProps> = ({ setAccessToken, setError }) => {
  let history = useHistory();

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");
    
    if (code) {
      axios
        .post(`${SERVER_URL}/login/discord`, { code }, { headers: { "Content-Type": "application/json" }})
        .then(({ data }) => {
          setAccessToken(data.accessToken);
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
  }, [setAccessToken, setError, history]);

  return (
    <div>
      <p>loading...</p>
    </div>
  );
}

export default Home;