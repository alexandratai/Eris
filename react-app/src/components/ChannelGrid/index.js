import "./ChannelGrid.css";
import Channel from "../Channel";

import { useSelector, useDispatch } from "react-redux";
import { allChannelsByServerIdThunk } from "../../store/channels";
import EditServerForm from "../EditServerForm";
import { useParams, Redirect } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import OpenModalButton from "../OpenModalButton";

const ChannelGrid = () => {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();
  const { serverId, channelId } = useParams();

  const channelObj = useSelector((state) => state.channels);
  const channelArr = Object.values(channelObj).filter((channel) => {
    return channel.server_id == serverId;
  });

  const serverObj = useSelector((state) => state.servers);
  const serverArr = Object.values(serverObj);

  const server = serverArr.find(server => server.id === parseInt(serverId));

  const sessionUser = useSelector((state) => state.session.user)

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
    if (sessionUser) {
      return (
        <OpenModalButton
          buttonText="Edit Server"
          modalComponent={<EditServerForm server={server} />}
        />
      );
    }
  };
  
  if (isLoaded && !channelId && channelArr.length > 0) return <Redirect to={`/${serverId}/${channelArr[0].id}`} />

  const ulClassName = "server-dropdown" + (showMenu ? "" : " hidden");
  const closeMenu = () => setShowMenu(false);
 
  return (
    <>
      <div className="channel-grid">
        <button onClick={openMenu} className="server-dropdown">
        {server && server.name} <i className="fa-solid fa-angle-down"></i>
        </button>
        <ul className={ulClassName} ref={ulRef} id="server-dropdown-list">
          <>
            <li>{editServer()}</li>
          </>
          </ul>
        <br></br>
        {channelArr.length > 0 &&
          channelArr.map((channel) => {
            return <Channel key={channel.id} channel={channel} />;
          })}
      </div>
    </>
  );
};

export default ChannelGrid;
