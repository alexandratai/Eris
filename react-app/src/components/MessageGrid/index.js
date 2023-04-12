import "./MessageGrid.css";
import Message from "../Message";
import CreateMessageForm from "../CreateMessageForm";

import { useSelector, useDispatch } from "react-redux";
import { allMessagesByChannelIdThunk } from "../../store/messages";
import { useParams } from "react-router-dom";
import { useState, useEffect, useRef, useContext } from "react";
// import { SocketContext } from "../../socket";
import { resetMessage } from "../../store/messages";
import { addMessage, editMessage, deleteMessage } from "../../store/messages";
import { io } from "socket.io-client";

let socket;

const MessageGrid = () => {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const { serverId, channelId } = useParams();
  // const socket = useContext(SocketContext);

  const messagesObj = useSelector((state) => state.messages);
  const messagesArr = Object.values(messagesObj);

  const [messages, setMessages] = useState(messagesArr);

  const messageGridRef = useRef(null);

  const scrollToBottom = () => {
    messageGridRef.current.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });
  };

  useEffect(() => {
    if (messageGridRef.current) {
      scrollToBottom();
    }
  }, [messageGridRef, messagesArr]);

  useEffect(() => {
    socket = io();
    if (channelId) {
      dispatch(allMessagesByChannelIdThunk(channelId))
        .then((data) => {
          setMessages(data);
        })
        .then(() => setIsLoaded(true));
    }

    if (channelId) {
      socket.emit("subscribe", { channel_id: channelId });
      socket.on("chat", (chat) => {
        chat = JSON.parse(chat);
        if (chat.isEdited) {
          dispatch(editMessage(chat));
        } else {
          dispatch(addMessage(chat));
        }
      });

      socket.on("delete", (id) => {
          dispatch(deleteMessage(id));
      });
    }

    return () => {
      dispatch(resetMessage());
      if (channelId) {
        socket.disconnect();
      }
    };
  }, [dispatch, serverId, channelId]);

  const handleChat = async (serverId, channelId, payload) => {
    socket.emit("chat", payload);
    return payload;
  };

  const handleDelete = async (id) => {
      socket.emit("delete", { channelId, id });
  };

  return (
    <>
      <div className="messages-grid">
        {messagesArr.length > 0 &&
          messagesArr.map((message) => {
            return (
              <Message
                key={message.id}
                id={message.id}
                message={message}
                handleDelete={handleDelete}
              />
            );
          })}
      </div>
      <div className="messages-grid-create-message-form">
        <CreateMessageForm
          serverId={serverId}
          channelId={channelId}
          handleChat={handleChat}
        />
      </div>
      <div ref={messageGridRef}></div>
    </>
  );
};

export default MessageGrid;
