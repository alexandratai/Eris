import "./CreateChannelForm.css";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeChannelThunk } from "../../store/channels";
import { useModal } from "../../context/Modal";
import { useHistory } from "react-router-dom";

const CreateChannelForm = ({ serverId }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const sessionUser = useSelector((state) => state.session.user);
  
    const [name, setName] = useState("");
    const [errors, setErrors] = useState([]);
    const { closeModal } = useModal();
  
    const updateName = (e) => setName(e.target.value);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      const payload = {
        name,
        serverId
      };
  
      const createdChannel = await dispatch(makeChannelThunk(serverId, payload))
      if (!createdChannel.id) {
        setErrors(createdChannel);
      } else {
        closeModal()
        history.push(`/${serverId}/${createdChannel.id}`)
      }
    };
  
    return sessionUser.id ? (
      <form className="create-channel-form-overall-div" style={{opacity: "90%"}} onSubmit={handleSubmit}>
        <ul>
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
        <div className="create-channel-modal">
          <p className="create-channel-form-title">Channel Name</p>
          <input
            type="text"
            placeholder="new-channel"
            value={name}
            onChange={updateName}
            required
          />
  
          <div>
            <button className="create-channel-button" type="submit">
              Create Channel
            </button>
          </div>
        </div>
      </form>
    ) : null;
  };
  
  export default CreateChannelForm;