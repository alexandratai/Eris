import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/session";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import { useModal } from "../../context/Modal";
import { useHistory, useParams } from "react-router-dom";
import * as sessionActions from "../../store/session";
import CreateServerForm from "../CreateServerForm";
import "./Navigation.css";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();
  const { closeModal } = useModal();
  const sessionUser = useSelector((state) => state.session.user);
  const { serverId } = useParams();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  const closeMenu = () => setShowMenu(false);
  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logout()).then(() => history.push(`/`)).then(() => closeMenu());
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  const demoSubmit = (e) => {
    e.preventDefault();
    closeModal();
    return dispatch(sessionActions.demoLogin()).then(() => closeMenu());
  };

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
    <>
      <button onClick={openMenu}>
        <i className="fas fa-user-circle" />
      </button>

      {showMenu && (
        <ul
          className={
            sessionUser == null
              ? ulClassName
              : "profile-button-profile-dropdown-logged-in"
          }
          ref={ulRef}
        >
          {user ? (
            <>
              <li>{user.username}</li>
              <li className="profile-button-username-email">{user.email}</li>
              <li>{createServer()}</li>
              <li>
                <button onClick={handleLogout}>Log Out</button>
              </li>
            </>
          ) : (
            <>
              <OpenModalButton
                buttonText="Log In"
                closeMenu={closeMenu}
                modalComponent={<LoginFormModal />}
              />

              <OpenModalButton
                buttonText="Sign Up"
                closeMenu={closeMenu}
                modalComponent={<SignupFormModal />}
              />

              <form className="demo-login-div" onSubmit={demoSubmit}>
                <button className="demo-login">Demo Login</button>
              </form>
            </>
          )}
        </ul>
      )}
    </>
  );
};

export default ProfileButton;
