import "./MessageGrid.css";
import Message from "../Message";
import CreateMessageForm from "../CreateMessageForm";

import { useSelector, useDispatch } from "react-redux";
import { allMessagesByChannelIdThunk } from "../../store/messages";
import { useParams } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { SocketContext } from "../../socket";
import { makeMessageThunk } from "../../store/messages";
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

  useEffect(() => {
    socket = io();
    if (channelId) {
      dispatch(allMessagesByChannelIdThunk(channelId)).then((data) => {
        setMessages(data)
      }).then(() =>
        setIsLoaded(true)
      );
    }

    if (channelId) {
      socket.emit("subscribe", { channel_id: channelId });
      socket.on("chat", (chat) => {
        chat = JSON.parse(chat);
        if (chat.isEdited) {
          // setMessages((messages) => {
            dispatch(editMessage(chat));
            // const index = messages.findIndex((message) => message.id == chat.id);
            // messages[index] = chat;
            // return [...messages];
            // dispatch editMessage with the chat that we got back
            // add isEdited key on the backend
          // });
        } else if (chat.isDeleted) {
          dispatch(deleteMessage(chat));
          // setMessages((messages) => {
          //   const index = messages.findIndex((message) => message.id == chat.id);
          //   messages.splice(index, 1);
          //   return [...messages];
          // });
        } else {
          dispatch(addMessage(chat));
          // setMessages((messages) => [...messages, chat]);
        }
      });
    }

    return () => {
      dispatch(resetMessage());
      if (channelId) {
        // socket.emit("unsubscribe", { channel_id: channelId });
        socket.disconnect();
      }
    };

  }, [dispatch, serverId, channelId]);
  
  const handleChat = async (serverId, channelId, payload) => {
    // const createdChannelMessage = await dispatch(
    //   makeMessageThunk(serverId, channelId, payload)
    // );

    socket.emit("chat", payload);
    return payload;
  };

  return (
    <>
      <div className="messages-grid">
        {messagesArr.length > 0 &&
          messagesArr.map((message) => {
            return <Message key={message.id} message={message} />;
          })}
      </div>
      <div className="messages-grid-create-message-form">
        <CreateMessageForm serverId={serverId} channelId={channelId} handleChat={handleChat} />
      </div>
    </>
  );
};

export default MessageGrid;
