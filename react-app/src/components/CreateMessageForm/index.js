import "./CreateMessageForm.css";

import { useState, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeMessageThunk } from "../../store/messages";
import { allUserServersThunk } from "../../store/servers";
import { allChannelsByServerIdThunk } from "../../store/channels";
import { useHistory } from "react-router-dom";
import { SocketContext } from "../../socket";
import MessageImageUpload from "../MessageImageUpload";

const CreateMessageForm = ({ serverId, channelId, handleChat }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const socket = useContext(SocketContext);
  const sessionUser = useSelector((state) => state.session.user);
  const channelObj = useSelector((state) => state.channels);
  const channel = Object.values(channelObj).find((channel) => {
    return channel.id == channelId;
  });

  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [errors, setErrors] = useState([]);
  const [imageUploaded, setImageUploaded] = useState(false);

  const updateBody = (e) => setBody(e.target.value);

  useEffect(() => {
    if (sessionUser) {
    dispatch(allUserServersThunk())
      .then(dispatch(allChannelsByServerIdThunk(serverId)))
      .then(() => setIsLoaded(true));
    }
  }, [dispatch, serverId, channelId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      body,
      image,
      serverId,
      channelId,
      userId: sessionUser.id

    };
    
    let createdChannelMessage = await handleChat(serverId, channelId, payload);
    
    // if (!createdChannelMessage.id) {
      //   setErrors(createdChannelMessage);
      // }
      
      setBody("");
      setImage("");
      
      setFormSubmitted(true);
      setImageUploaded(false);
  };

  return sessionUser.id ? (
    <div className="create-message-overall-div">
      <MessageImageUpload setImage={setImage} formSubmitted={formSubmitted} image={image} imageUploaded={imageUploaded} setImageUploaded={setImageUploaded} />
      <form onSubmit={handleSubmit}>
        <ul>
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
        <div className="create-message-form">
          <input
            type="text"
            placeholder={`Message #${channel && channel.name}`}
            value={body}
            onChange={updateBody}
            required
          />

            <button className="create-message-button" type="submit">
              Send Message
            </button>
        </div>
      </form>
    </div>
  ) : null;
};

export default CreateMessageForm;
