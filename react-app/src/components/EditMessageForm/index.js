import "./EditMessageForm.css";
import { useState, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { allMessagesByChannelIdThunk } from "../../store/messages";
import { editMessageThunk } from "../../store/messages";
import { SocketContext } from "../../socket";
import MessageImageUpload from "../MessageImageUpload";

const EditMessageForm = ({ serverId, channelId, message, setShowForm }) => {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);

  const [body, setBody] = useState(message.body);
  const [tempImage, setTempImage] = useState(message.image);
  const [image, setImage] = useState(message.image);
  const [isLoaded, setIsLoaded] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [errors, setErrors] = useState([]);
  const socket = useContext(SocketContext);

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
      image: tempImage ? tempImage : null, // Use null if tempImage is not set,
      serverId,
      channelId,
      id: message.id,
      userId: sessionUser.id
    };

    // const editedChannelMessage = await dispatch(
    //   editMessageThunk(serverId, channelId, payload)
    // ).then(setShowForm(false));
    
    // if (!editedChannelMessage.id) {
    //   setErrors(editedChannelMessage);
    // } else {
      // editedChannelMessage.isEdited = true;
      // socket.emit("chat", editedChannelMessage);
      payload.isEdited = true;
      socket.emit("chat", payload);
      setShowForm(false);
      
      setImage(tempImage);
      setFormSubmitted(true);
    // }
  };

  const handleCancel = () => {
    setShowForm(false);
    setImage(message.image); // restore original image
  };

  return sessionUser.id ? (
    <>
      <MessageImageUpload setImage={setTempImage} formSubmitted={formSubmitted} isEditing={true} image={image} />
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

          <div>
            <button className="edit-channel-button" type="submit">
              Save
            </button>
            <button type="cancel" onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      </form>
    </>
  ) : null;
};

export default EditMessageForm;
