import "./EditMessageForm.css";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { allMessagesByChannelIdThunk } from "../../store/messages";
import { editMessageThunk } from "../../store/messages";
import { useModal } from "../../context/Modal";
import { useHistory } from "react-router-dom";

const EditMessageForm = ({ serverId, channelId, message, setShowForm }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const sessionUser = useSelector((state) => state.session.user);
 
    const [body, setBody] = useState(message.body);
    const [image, setImage] = useState(message.image);
    const [isLoaded, setIsLoaded] = useState(false);
    const [errors, setErrors] = useState([]);
    const { closeModal } = useModal();
  
    const updateBody = (e) => setBody(e.target.value);
    const updateImage = (e) => setImage(e.target.value);

    useEffect(() => {
        dispatch(allMessagesByChannelIdThunk(channelId)).then(() => setIsLoaded(true));
      }, [dispatch, channelId]);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      const payload = {
        body,
        image,
        serverId,
        channelId,
        id: message.id
      };
  
      const editedChannelMessage = await dispatch(editMessageThunk(serverId, channelId, payload)).then(setShowForm(false))
      if (!editedChannelMessage.id) {
        setErrors(editedChannelMessage);
      } else {
        closeModal()
        history.push(`/${serverId}/${channelId}`)
      }
    };
  
    return sessionUser.id ? (
      <form onSubmit={handleSubmit}>
        <ul>
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
        <div className="edit-channel-message-form">
          <input
            type="text"
            placeholder={body}
            value={body}
            onChange={updateBody}
            required
          />
  
          <input
            type="text"
            placeholder={image || "Image url"}
            value={image}
            onChange={updateImage}
          />
          <div>
            <button className="edit-channel-button" type="submit">
              Send Message
            </button>
          </div>
        </div>
      </form>
    ) : null;
  };
  
  export default EditMessageForm;