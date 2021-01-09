import React, { useState } from "react";
import { CookiesProvider } from "react-cookie";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { render } from "react-dom";
import { IUser } from "./models";

import Home from "./components/Home";
import Profile from "./components/Profile";
import Login from "./components/Login";
import NotFound from "./components/NotFound";

const Router: React.FC = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" render={() => <Home error={error} />} />
        <Route path="/profile" render={() => <Profile user={user} setUser={setUser} />} />
        <Route path="/login" render={() => <Login setUser={setUser} setError={setError} />} />
        <Route component={NotFound} />
      </Switch>
    </BrowserRouter>
  );
};

render(
  <CookiesProvider>
    <Router />
  </CookiesProvider>,
  document.getElementById("root")
);
