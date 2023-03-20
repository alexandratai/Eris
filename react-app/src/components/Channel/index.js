import "./Channel.css";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

const Channel = ({ channel }) => {
  const { serverId } = useParams();
    return (
      <>
        <div>
        <Link to={`/${serverId}/${channel.id}`}>{channel.name}</Link>
        </div>
      </>
    );
  };
  
  export default Channel;