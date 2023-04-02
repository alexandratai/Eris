import "./CreateMessageForm.css";

import { useState, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeMessageThunk } from "../../store/messages";
import { allUserServersThunk } from "../../store/servers";
import { allChannelsByServerIdThunk } from "../../store/channels";
import { useHistory } from "react-router-dom";
import { SocketContext } from "../../socket";
import ImageUpload from "../ImageUpload";

const CreateMessageForm = ({ serverId, channelId }) => {
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

  const updateBody = (e) => setBody(e.target.value);

  useEffect(() => {
    dispatch(allUserServersThunk())
      .then(dispatch(allChannelsByServerIdThunk(serverId)))
      .then(() => setIsLoaded(true));
  }, [dispatch, serverId, channelId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      body,
      image,
      serverId,
      channelId,
    };

    const createdChannelMessage = await dispatch(
      makeMessageThunk(serverId, channelId, payload)
    );
    if (!createdChannelMessage.id) {
      setErrors(createdChannelMessage);
    }
    setBody("");
    setImage("");
    socket.emit("chat", createdChannelMessage);

    setFormSubmitted(true);
  };

  return sessionUser.id ? (
    <>
      <ImageUpload setImage={setImage} formSubmitted={formSubmitted} />
      <form onSubmit={handleSubmit}>
        <ul>
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
        <div className="create-channel-message-form">
          <input
            type="text"
            placeholder={`Message #${channel && channel.name}`}
            value={body}
            onChange={updateBody}
            required
          />

          <div>
            <button className="create-channel-button" type="submit">
              Send Message
            </button>
          </div>
        </div>
      </form>
    </>
  ) : null;
};

export default CreateMessageForm;
