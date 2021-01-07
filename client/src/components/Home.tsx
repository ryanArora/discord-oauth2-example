import React from "react";
import { DISCORD_CLIENT_ID } from "../constants";

interface IHomeProps {
  error: string | null;
}

const Home: React.FC<IHomeProps> = ({ error }) => {
  const redirect = encodeURIComponent(window.location.protocol + "//" + window.location.host + "/login");
  const url = `https://discordapp.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&scope=identify&response_type=code&redirect_uri=${redirect}`;

  return (
    <div>
      <p>hello oauth2</p>
      <button onClick={() => {
        window.location.href = url;
      }}>login with discord</button>
    </div>
  );
}

export default Home;