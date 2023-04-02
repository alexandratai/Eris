import "./Message.css";
import EditMessageForm from "../EditMessageForm";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState, useContext, useEffect } from "react";
import { deleteMessageThunk } from "../../store/messages";
import { SocketContext } from "../../socket";

const Message = ({ message }) => {
  const dispatch = useDispatch();
  const socket = useContext(SocketContext);
  const { serverId, channelId } = useParams();

  const sessionUser = useSelector((state) => state.session.user);
  const messagesObj = useSelector((state) => state.messages);
  const messageArr = Object.values(messagesObj);

  const [errors, setErrors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [userProfilePhotoDisplay, setUserProfilePhotoDisplay] = useState(false);

  useEffect(() => {
    if (messageArr.length > 1) {
      const previousMessage = messageArr[messageArr.indexOf(message) - 1];
      if (previousMessage && previousMessage.user.id == message.user.id) {
        setUserProfilePhotoDisplay(false);
      } else {
        const userMessages = messageArr.filter((m) => m.user.id == message.user.id);
        if (userMessages.length == 1 || userMessages[0].id == message.id) {
          setUserProfilePhotoDisplay(true);
        } else {
          setUserProfilePhotoDisplay(false);
        }
      }
    } else {
      setUserProfilePhotoDisplay(true);
    }
  }, [messageArr, message]);

  const editMessage = () => {
    return (
      <EditMessageForm
        serverId={serverId}
        channelId={channelId}
        message={message}
        setShowForm={setShowForm}
      />
    );
  };

  const handleDelete = async () => {
    // e.preventDefault();

    const deletedChannelMessage = await dispatch(
      deleteMessageThunk(message.id)
    );

    if (!deletedChannelMessage) {
      setErrors(deletedChannelMessage);
    } else {
      deletedChannelMessage.isDeleted = true;
      deletedChannelMessage.channel_id = parseInt(channelId);
      deletedChannelMessage.id = message.id;
      socket.emit("chat", deletedChannelMessage);
    }
  };

  const messageDeleter = () => {
    const confirm = window.confirm(
      `Are you sure you want to delete this message?`
    );
    if (confirm) {
      handleDelete();
    }
  };

  const userDeleteMessage = () => {
    if (sessionUser && message && sessionUser.id == message.user.id) {
      return (
        <button
          className="message-page-delete-button"
          onClick={() => {
            messageDeleter();
          }}
        >
          Delete Message <i className="fa-sharp fa-solid fa-trash-can"></i>
        </button>
      );
    }
  };

  return (
    <>
      <div>
        {userProfilePhotoDisplay ? (
          <>
            <img
              className="messages-grid-message-profile-photo"
              src={message.user.profile_photo}
            />
            <p>{message.user.username}</p>
            <p>{message.body}</p>
            <img src={message.image} />

            {sessionUser &&
              sessionUser.id &&
              sessionUser.id == message.user.id && (
                <button
                  className="edit-message-form-button"
                  onClick={() => setShowForm(true)}
                >
                  <i className="fa-solid fa-pencil"></i>
                </button>
              )}
            {showForm && editMessage()}
            {userDeleteMessage()}
          </>
        ) : (
          <>
            {message.body}
            {sessionUser &&
              sessionUser.id &&
              sessionUser.id == message.user.id && (
                <button
                  className="edit-message-form-button"
                  onClick={() => setShowForm(true)}
                >
                  <i className="fa-solid fa-pencil"></i>
                </button>
              )}
            {showForm && editMessage()}
            {userDeleteMessage()}
          </>
        )}
      </div>
    </>
  );
};

export default Message;
