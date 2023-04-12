import "./Message.css";
import EditMessageForm from "../EditMessageForm";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState, useContext, useEffect } from "react";
// import { SocketContext } from "../../socket";

const Message = ({ id, message, handleDelete }) => {
  const dispatch = useDispatch();
  // const socket = useContext(SocketContext);
  const { serverId, channelId } = useParams();

  const sessionUser = useSelector((state) => state.session.user);
  const messagesObj = useSelector((state) => state.messages);
  const messageArr = Object.values(messagesObj);

  const [errors, setErrors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [userProfilePhotoDisplay, setUserProfilePhotoDisplay] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (messageArr.length > 1) {
      const previousMessage = messageArr[messageArr.indexOf(message) - 1];
      if (previousMessage && previousMessage.user.id == message.user.id) {
        setUserProfilePhotoDisplay(false);
      } else {
        const userMessages = messageArr.filter(
          (m) => m.user.id == message.user.id
        );
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

  const messageDeleter = async () => {
    const confirm = window.confirm(
      `Are you sure you want to delete this message?`
    );
    if (confirm) {
      await handleDelete(message.id);
    }
  };

  const userDeleteMessage = () => {
    if (sessionUser && message && sessionUser.id == message.user.id) {
      return (
        <button
          className={`message-page-delete-button ${
            hovered ? "visible" : "hidden"
          }`}
          onClick={() => {
            messageDeleter();
          }}
        >
          <i className="fa-sharp fa-solid fa-trash-can"></i>
        </button>
      );
    }
  };

  return (
    <>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {userProfilePhotoDisplay ? (
          <div className="messages-overall-grid">
            <div className="messages-profile-photo-and-username">
              <img
                className="messages-message-profile-photo"
                src={message.user.profile_photo}
              />
              <div className="messages-with-user-and-body">
                <p className="messages-username">{message.user.username}</p>
                <p className="messages-with-user-message-body">
                  {message.body}
                </p>
              </div>
            </div>
            {showForm ? (
              <EditMessageForm
                serverId={serverId}
                channelId={channelId}
                message={message}
                setShowForm={setShowForm}
              />
            ) : (
              <>
                <div className="messages-edit-delete-buttons">
                  {message.image && (
                    <img
                      src={message.image}
                      className="messages-message-photo"
                    />
                  )}
                  <div className="messages-edit-delete-buttons-div-with-user">
                    {sessionUser &&
                      sessionUser.id &&
                      sessionUser.id == message.user.id && (
                        <button
                          className={`edit-message-form-button ${
                            hovered ? "visible" : "hidden"
                          }`}
                          onClick={() => setShowForm(true)}
                        >
                          <i className="fa-solid fa-pencil"></i>
                        </button>
                      )}
                      {userDeleteMessage()}
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <>
            {showForm ? (
              <EditMessageForm
                serverId={serverId}
                channelId={channelId}
                message={message}
                setShowForm={setShowForm}
              />
            ) : (
              <>
                {message.image && (
                  <img src={message.image} className="messages-message-photo" />
                )}
                <div className="messages-user-not-shown-message-div">
                  <p className="messages-user-not-shown-message">
                    {message.body}
                  </p>
                  <div className="messages-edit-delete-buttons-div">
                    {sessionUser &&
                      sessionUser.id &&
                      sessionUser.id == message.user.id && (
                        <button
                          className={`edit-message-form-button ${
                            hovered ? "visible" : "hidden"
                          }`}
                          onClick={() => setShowForm(true)}
                        >
                          <i className="fa-solid fa-pencil"></i>
                        </button>
                      )}
                    {userDeleteMessage()}
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Message;
