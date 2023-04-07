import React from "react";
import { NavLink, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";
import CreateServerForm from "../CreateServerForm";
import OpenModalButton from "../OpenModalButton";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);
  const { serverId } = useParams();

  const createServer = () => {
    if (sessionUser) {
      return (
        <OpenModalButton
          buttonText="Add a Server"
          modalComponent={<CreateServerForm server={serverId} />}
        />
      );
    }
  };

  return (
    <ul className="navigation-bar">
      <li>
        <NavLink exact to="/">
          Home
        </NavLink>
      </li>
      {isLoaded && (
        <li>
          <ProfileButton user={sessionUser} />
        </li>
      )}
      <li>{createServer()}</li>
    </ul>
  );
}

export default Navigation;
