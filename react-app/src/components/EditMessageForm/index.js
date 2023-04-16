import "./EditMessageForm.css";
import { useState, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { allMessagesByChannelIdThunk } from "../../store/messages";
import { editMessageThunk } from "../../store/messages";
import { SocketContext } from "../../socket";
import MessageImageUpload from "../MessageImageUpload";

const EditMessageForm = ({ serverId, channelId, message, setShowEditMessageForm }) => {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);

  const [body, setBody] = useState(message.body);
  const [tempImage, setTempImage] = useState(message.image);
  const [image, setImage] = useState(message.image);
  const [isLoaded, setIsLoaded] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [errors, setErrors] = useState([]);
  const socket = useContext(SocketContext);
  const [imageUploaded, setImageUploaded] = useState(false);

  const updateBody = (e) => setBody(e.target.value);

  useEffect(() => {
    const abortController = new AbortController();
    dispatch(allMessagesByChannelIdThunk(channelId)).then(() =>
      setIsLoaded(true)
    );
    return () => abortController.abort(); // cleanup function
  }, [dispatch, channelId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      body,
      image: tempImage ? tempImage : null, 
      serverId,
      channelId,
      id: message.id,
      userId: sessionUser.id
    };

      payload.isEdited = true;
      socket.emit("chat", payload);
      setShowEditMessageForm(false);
      
      setImage(tempImage);
      setFormSubmitted(true);
  };

  const handleCancel = () => {
    setShowEditMessageForm(false);
    setImage(message.image); // Restore original image
  };

  return sessionUser.id ? (
    <div className="edit-channel-message-form">
      <MessageImageUpload setImage={setImage} formSubmitted={formSubmitted} isEditing={true} image={image} imageUploaded={imageUploaded} setImageUploaded={setImageUploaded} />
      <form onSubmit={handleSubmit}>
        <ul>
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
        <div className="edit-channel-message-input-and-buttons">
          <input
            type="text"
            placeholder={body}
            value={body}
            onChange={updateBody}
            required
          />

          <div className="edit-channel-message-buttons-div">
            <button className="edit-channel-message-button" type="submit">
              Save
            </button>
            <button type="button" onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      </form>
    </div>
  ) : null;
};

export default EditMessageForm;
