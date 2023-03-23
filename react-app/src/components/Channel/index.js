import "./Channel.css";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import EditChannelForm from "../EditChannelForm";
import OpenModalButton from "../OpenModalButton";

const Channel = ({ channel }) => {
  const { serverId, channelId } = useParams();
  const serverObj = useSelector((state) => state.servers);
  const server = serverObj[serverId];

  const sessionUser = useSelector((state) => state.session.user);

  const editChannel = () => {
    if (sessionUser && server && (sessionUser.id == server.owner_id) && channelId && (channel.id == channelId)) {
      return (
        <OpenModalButton
          buttonText={<i className="fa-sharp fa-solid fa-gear"></i>}
          modalComponent={<EditChannelForm channel={channel} serverId={serverId} />}
        />
      );
    }
  };

    return (
      <>
        <div>
        <Link to={`/${serverId}/${channel.id}`}>{channel.name}</Link> {editChannel()}
        </div>
      </>
    );
  };
  
  export default Channel;