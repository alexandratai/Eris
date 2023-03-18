import "./ServerGrid.css";
import Server from "../Server";
import { useSelector, useDispatch } from "react-redux";
import { allUserServersThunk } from "../../store/servers";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

const ServerGrid = () => {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  const serverObject = useSelector((state) => state.servers);
  const serverArr = Object.values(serverObject);
  const { serverId } = useParams();

  useEffect(() => {
    dispatch(allUserServersThunk(serverId)).then(() => setIsLoaded(true));
  }, [dispatch, serverId]);

  return (
    <>
      <div className="server-grid">
        {serverArr.length > 0 &&
          serverArr.map((server) => {
            return <Server key={server.id} server={server} />;
          })}
      </div>

      <div>This is the server grid.</div>
    </>
  );
};

export default ServerGrid;
