import "./ChannelGrid.css";
import Channel from "../Channel";

import { useSelector, useDispatch } from "react-redux";
import { allChannelsByServerIdThunk } from "../../store/channels";
import { allUserServersThunk } from "../../store/servers";
import { deleteServerThunk } from "../../store/servers";
import EditServerForm from "../EditServerForm";
import CreateChannelForm from "../CreateChannelForm";
import { useParams, Redirect, useHistory } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import OpenModalButton from "../OpenModalButton";

const ChannelGrid = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [isLoaded, setIsLoaded] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();
  const { serverId, channelId } = useParams();

  const channelObj = useSelector((state) => state.channels);
  const channelArr = Object.values(channelObj).filter((channel) => {
    return channel.server_id == serverId;
  });

  const serverObj = useSelector((state) => state.servers);
  const server = serverObj[serverId];

  const sessionUser = useSelector((state) => state.session.user);

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  // if statement - if no channelId && isLoaded &&
  // channelArr.length > 0, cause a redirect to the 1st
  // channel in channelArr
  // If a user clicks on a server, it takes then to /1 or /4

  useEffect(() => {
    if (serverId) {
      dispatch(allChannelsByServerIdThunk(serverId))
        .then(dispatch(allUserServersThunk()))
        .then(() => setIsLoaded(true));
    }
  }, [dispatch, serverId]);

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

  const editServer = () => {
    if (sessionUser && server && server.owner_id == sessionUser.id) {
      return (
        <OpenModalButton
          buttonText="Edit Server"
          modalComponent={<EditServerForm server={server} />}
        />
      );
    }
  };

  if (isLoaded && !channelId && channelArr.length > 0)
    return <Redirect to={`/${serverId}/${channelArr[0].id}`} />;

  const ulClassName = "server-dropdown" + (showMenu ? "" : " hidden");
  const closeMenu = () => setShowMenu(false);

  const serverDeleter = () => {
    const confirm = window.confirm(
      `Are you sure you wish to delete your server "${server.name}"?`
    );
    if (confirm) {
      return dispatch(deleteServerThunk(serverId)).then(() => {
        return history.push("/@me");
      });
    }
  };

  const userDeleteServer = () => {
    if (sessionUser && server && sessionUser.id == server.owner_id) {
      return (
        <button
          className="server-page-delete-button"
          onClick={() => {
            serverDeleter();
          }}
        >
          Delete Server
        </button>
      );
    }
  };

  const createChannel = () => {
    if (sessionUser && server && sessionUser.id == server.owner_id) {
      return (
        <OpenModalButton
          buttonText={<i className="fa-sharp fa-regular fa-plus"></i>}
          modalComponent={<CreateChannelForm serverId={serverId} />}
        />
      );
    }
  };

  return (
    <>
      <div className="channel-grid">
        {isLoaded && (
          <>
                <div onClick={openMenu} className="server-dropdown">
                  {server && server.name} <i className="fa-solid fa-angle-down" id="channel-grid-server-dropdown-button"></i>
                </div>
                <ul
                  className={ulClassName}
                  ref={ulRef}
                  id="server-dropdown-list"
                >
                  <>
                    <li>{editServer()}</li>
                    <li>{userDeleteServer()}</li>
                  </>
                </ul>
                <br></br>

                <p className="channel-grid-text-channels-with-add-channel-button-div">Text Channels <div className="channel-grid-add-channel-button">{createChannel()}</div></p>
            {channelArr.length > 0 &&
              channelArr.map((channel) => {
                return <Channel key={channel.id} channel={channel} />;
              })}
          </>
        )}
      </div>
    </>
  );
};

export default ChannelGrid;
