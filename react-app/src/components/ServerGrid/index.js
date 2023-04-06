import "./ServerGrid.css";
import Server from "../Server";
import { useSelector, useDispatch } from "react-redux";
import { allUserServersThunk } from "../../store/servers";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import ChannelGrid from "../ChannelGrid";
import MessageGrid from "../MessageGrid";

const ServerGrid = () => {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const { serverId } = useParams();

  const serverObject = useSelector((state) => state.servers);
  const serverArr = Object.values(serverObject);

  useEffect(() => {
    dispatch(allUserServersThunk(serverId)).then(() => setIsLoaded(true));
  }, [dispatch, serverId]);

  return (
    <div className="server-grid-channel-grid-message-grid">
      <div className="server-grid">
        {serverArr.length > 0 &&
          serverArr.map((server) => {
            return <Server key={server.id} server={server} />;
          })}
      </div>
      <div className="channel-grid">
        <ChannelGrid />
      </div>
      <div className="message-grid">
        <MessageGrid />
      </div>
    </div>
  );
};

export default ServerGrid;
