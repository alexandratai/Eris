import "./Server.css";
import { Link } from "react-router-dom";

const Server = ({ server }) => {
  return (
    <>
      <div>
      <Link to={`/${server.id}`}><img className="server-image" src={server.image || "https://static.wixstatic.com/media/2e2561_64f61c7b95154d909d3bedc1d70c0ae5~mv2.jpg"} title={server.name} alt="" /></Link>
      </div>
    </>
  );
};

export default Server;
