import "./Message.css";
import EditMessageForm from "../EditMessageForm";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState, useContext } from "react";
import { deleteMessageThunk } from "../../store/messages";
import { SocketContext } from "../../socket";

const Message = ({ message }) => {
  const { serverId, channelId } = useParams();
  const sessionUser = useSelector((state) => state.session.user);
  const dispatch = useDispatch();
  const socket = useContext(SocketContext);
  const [errors, setErrors] = useState([]);

  const [showForm, setShowForm] = useState(false);

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

    const deletedChannelMessage = await dispatch(deleteMessageThunk(message.id));

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
    if (sessionUser && message && sessionUser.id == message.user_id) {
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
      {showForm == true ? (
        editMessage()
      ) : (
        <>
          <div>
            {message.body}
            {sessionUser &&
              sessionUser.id &&
              sessionUser.id == message.user_id && (
                <button
                  className="edit-message-form-button"
                  onClick={() => setShowForm(true)}
                >
                  <i className="fa-solid fa-pencil"></i>
                </button>
              )}
            {userDeleteMessage()}
          </div>
        </>
      )}
    </>
  );
};

export default Message;
