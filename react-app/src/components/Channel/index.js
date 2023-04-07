import "./Channel.css";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
import OpenModalButton from "../OpenModalButton";
import EditChannelForm from "../EditChannelForm";

const Channel = ({ channel }) => {
  const { serverId, channelId } = useParams();
  const serverObj = useSelector((state) => state.servers);
  const server = serverObj[serverId];
  
  const sessionUser = useSelector((state) => state.session.user);

  const [isShown, setIsShown] = useState(false);

  const editChannel = () => {
    if (
      sessionUser &&
      server &&
      sessionUser.id == server.owner_id &&
      channelId
    ) {
      return (
          <OpenModalButton
            buttonText={<i className="fa-sharp fa-solid fa-gear"></i>}
            modalComponent={
              <EditChannelForm channel={channel} serverId={serverId} />
            }
          />
      );
    }
  };

  return (
    <>
      <div
      onMouseEnter={() => setIsShown(true)}
      onMouseLeave={() => setIsShown(false)}>
        <Link to={`/${serverId}/${channel.id}`}>{channel.name}</Link>
        {isShown && (
          editChannel()
        )}
      </div>
    </>
  );
};

export default Channel;
