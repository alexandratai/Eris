import "./Channel.css";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState, Dispatch } from "react";
import OpenModalButton from "../OpenModalButton";
import EditChannelForm from "../EditChannelForm";
import { deleteChannelThunk } from "../../store/channels";

const Channel = ({ channel }) => {
  const dispatch = useDispatch();
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
      channelId &&
      channel.id == channelId
    ) {
      return (
        <div
          onMouseEnter={() => setIsShown(true)}
          onMouseLeave={() => setIsShown(false)}
        >
          {isShown && 
          <OpenModalButton
            buttonText={<i className="fa-sharp fa-solid fa-gear"></i>}
            modalComponent={
              <EditChannelForm channel={channel} serverId={serverId} />
            }
          />
          }
        </div>
      );
    }
  };

  const channelDeleter = () => {
    const confirm = window.confirm(
      `Are you sure you wish to delete your channel?`
    );
    if (confirm) {
      dispatch(deleteChannelThunk(channel));
    }
  };

  const deleteChannel = (e) => {
    if (
      sessionUser &&
      server &&
      sessionUser.id == server.owner_id &&
      channelId &&
      channel.id == channelId
    ) {
      return (
        <button
          className="channel-delete-button"
          onClick={() => {
            channelDeleter();
          }}
        >
          Delete Channel
        </button>
      );
    }
  };

  return (
    <>
      <div>
        <Link to={`/${serverId}/${channel.id}`}>{channel.name}</Link>
        {editChannel()}
        {deleteChannel()}
      </div>
    </>
  );
};

export default Channel;
