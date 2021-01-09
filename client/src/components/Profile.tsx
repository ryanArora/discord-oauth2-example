import axios from "axios";
import React, { Dispatch, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useHistory } from "react-router-dom";
import { IUser } from "../models";
import { SERVER_URL } from "../constants";

interface IProfileProps {
  user: IUser | null;
  setUser: Dispatch<IUser | null>;
}

const Profile: React.FC<IProfileProps> = ({ user, setUser }) => {
  let history = useHistory();

  const [cookies] = useCookies(["token"]);

  useEffect(() => {
    if (!cookies.token) {
      history.replace("/");
    }
  }, [cookies, history]);

  useEffect(() => {
    const token = cookies.token;

    if (!user) {
      axios
        .get(`${SERVER_URL}/profile`, { headers: { authorization: `Bearer ${token}` } })
        .then(({ data }) => {
          if (data.user) {
            setUser(data.user);
          }
        })
        .catch((err) => {
          console.log("Error", err);
        });
    }
  }, [cookies, user, setUser]);

  if (user) {
    return (
      <div>
        <p>{JSON.stringify(user, null, 2)}</p>
        <img alt="discord avatar" src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}`} />
      </div>
    );
  } else {
    return (
      <div>
        <p>no user</p>
      </div>
    );
  }
};

export default Profile;
