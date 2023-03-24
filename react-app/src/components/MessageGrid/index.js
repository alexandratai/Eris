import "./MessageGrid.css";
import Message from "../Message";
import CreateMessageForm from "../CreateMessageForm";

import { useSelector, useDispatch } from "react-redux";
import { allMessagesByChannelIdThunk } from "../../store/messages";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

const MessageGrid = () => {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const { serverId, channelId } = useParams();

  const messagesObj = useSelector((state) => state.messages);
  const messagesArr = Object.values(messagesObj).filter((message) => {
    return message.channel_id == channelId;
  });

  useEffect(() => {
    if (channelId) {
      dispatch(allMessagesByChannelIdThunk(channelId)).then(() =>
        setIsLoaded(true)
      );
    }
  }, [dispatch, channelId]);

  return (
    <>
      <div className="messages-grid">
        {messagesArr.length > 0 &&
          messagesArr.map((message) => {
            return <Message key={message.id} message={message} />;
          })}
      </div>
      <CreateMessageForm serverId={serverId} channelId={channelId} />
    </>
  );
};

export default MessageGrid;
