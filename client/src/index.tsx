import React, { useState } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { render } from "react-dom";

import Home from "./components/Home";
import Profile from "./components/Profile";
import Login from "./components/Login";
import NotFound from "./components/NotFound";

const Router: React.FC = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" render={() => <Home error={error}/>}/>
        <Route path="/profile" render={() => <Profile accessToken={accessToken}/>}/>
        <Route path="/login" render={() => <Login setAccessToken={setAccessToken} setError={setError} />} />
        <Route component={NotFound} />
      </Switch>
    </BrowserRouter>
  );
}

render(<Router />, document.getElementById("root"));