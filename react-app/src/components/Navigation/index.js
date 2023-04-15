import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  const serverObj = useSelector((state) => state.servers);
  const serverArr = Object.values(serverObj);
  let userServers;
  
  if (sessionUser !== null) {
    userServers = serverArr.filter(server => {
        return server.owner_id == sessionUser.id
    })
  };

  return (
    <ul className={(isLoaded && sessionUser == null) ? "navigation-bar-logged-out" : "navigation-bar-logged-in"}>
      <div className="navigation-home-and-profile-button-div">
      <li>
        <button className={(isLoaded && sessionUser !== null && userServers.length > 0) && "navigation-home-button-none"}>
        <NavLink exact to="/" className="navigation-home-button">
          Home
        </NavLink>
        </button>
      </li>
      {isLoaded && (
        <li>
          <ProfileButton user={sessionUser} />
        </li>
      )}
      </div>
    </ul>
  );
}

export default Navigation;
