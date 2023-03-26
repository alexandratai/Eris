import "./MessageGrid.css";
import Message from "../Message";
import CreateMessageForm from "../CreateMessageForm";

import { useSelector, useDispatch } from "react-redux";
import { allMessagesByChannelIdThunk } from "../../store/messages";
import { useParams } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { SocketContext } from "../../socket";

const MessageGrid = () => {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const { serverId, channelId } = useParams();
  const socket = useContext(SocketContext);
  
  const messagesObj = useSelector((state) => state.messages);
  const messagesArr = Object.values(messagesObj).filter((message) => {
    return message.channel_id == channelId;
  });
  
  const [messages, setMessages] = useState(messagesArr);

  useEffect(() => {
    if (channelId) {
      dispatch(allMessagesByChannelIdThunk(channelId)).then((data) => {
        setMessages(data)
      }).then(() =>
        setIsLoaded(true)
      );
    }
  }, [dispatch, channelId]);

  useEffect(() => {
    socket.emit("subscribe", { channel_id: channelId });
    socket.on("chat", (chat) => {

      if (chat.isEdited) {
        setMessages(messages => {
          const index = messages.findIndex(message => message.id == chat.id);
          messages[index] = chat;
          return [...messages];
        });
        // if else statement for delete here
      } else {
        setMessages((messages) => [...messages, chat]);
      };
    });

    return () => {
      socket.emit("unsubscribe", { channel_id: channelId })
      socket.disconnect();
    };
  }, []);

  return (
    <>
      <div className="messages-grid">
        {messages.length > 0 &&
          messages.map((message) => {
            return <Message key={message.id} message={message} />;
          })}
      </div>
      <div className="messages-grid-create-message-form">
        <CreateMessageForm serverId={serverId} channelId={channelId} />
      </div>
    </>
  );
};

export default MessageGrid;
