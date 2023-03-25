import "./Message.css";
import EditMessageForm from "../EditMessageForm";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";

const Message = ({ message }) => {
    const { serverId, channelId } = useParams();
    const sessionUser = useSelector((state) => state.session.user)

    const [showForm, setShowForm] = useState(false);
    
    const editMessage = () => {
          return (
            <EditMessageForm serverId={serverId} channelId={channelId} message={message} setShowForm={setShowForm} />
          )
    }

    return (
        <>
        {showForm == true ? editMessage() :  <>
        <div>{message.body}
        {sessionUser && sessionUser.id && (sessionUser.id == message.user_id) &&
        <button className="edit-message-form-button" onClick={() => setShowForm(true)}><i className="fa-solid fa-pencil"></i></button>}
        </div> 
        </>
        }
        </>
    );
};

export default Message;