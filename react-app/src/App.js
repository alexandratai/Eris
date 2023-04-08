import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import SignupFormPage from "./components/SignupFormPage";
import LoginFormPage from "./components/LoginFormPage";
import { authenticate } from "./store/session";
import Navigation from "./components/Navigation";
import HomePage from "./components/HomePage";
import ServerGrid from "./components/ServerGrid";
import ChannelGrid from "./components/ChannelGrid";
import MessageGrid from "./components/MessageGrid";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import UserSplashPage from "./components/UserSplashPage";
import "./index.css";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(authenticate()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <div className="app-overall-div">
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route path="/login">
            <LoginFormPage />
          </Route>
          <Route path="/signup">
            <SignupFormPage />
          </Route>
          <Route exact path="/@me">
            <UserSplashPage />
          </Route>
          <Route exact path="/">
            <HomePage />
          </Route>
          <ProtectedRoute>
            <Route exact path="/:serverId(\d+)?/:channelId(\d+)?">
              <ServerGrid />
            </Route>
          </ProtectedRoute>
        </Switch>
      )}
      <div className="app-photo-element-cloud-one"></div>
      <div className="app-photo-element-stars-one"></div>
      <div className="app-photo-element-cloud-two"></div>
      <div className="app-photo-element-stars-two"></div>
      <div className="app-photo-element-stars-three"></div>
      <div className="app-logo"></div>

      <iframe style={{borderRadius: '12px'}} src="https://open.spotify.com/embed/playlist/2DXbYkihVPRCWwpM9m0nT2?utm_source=generator&theme=0" width="70%" height="152" frameBorder="0" allowFullScreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
      <footer className="app-footer">
        <div>
          By Alexandra Tai{" "}
          <a href="https://www.linkedin.com/in/alexandratai" target="_blank">
            <i className="fa-brands fa-linkedin-in" id="app-footer-logo"></i>
          </a>{" "}
          <a href="https://github.com/alexandratai" target="_blank">
            <i className="fa-brands fa-github" id="app-footer-logo"></i>
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;
