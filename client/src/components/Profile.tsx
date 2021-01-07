import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";

interface IProfileProps {
  accessToken: string | null;
}

const Profile: React.FC<IProfileProps> = ({ accessToken }) => {
  let history = useHistory();

  useEffect(() => {
    if (!accessToken) {
      history.replace("/");
    }
  }, [accessToken, history]);

  return (
    <div>
      <p>Access Token: {accessToken}</p>
    </div>
  );
}

export default Profile;