import "./EditChannelForm.css";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { editChannelThunk } from "../../store/channels";
import { useModal } from "../../context/Modal";

const EditChannelForm = ({ channel, serverId }) => {
    const dispatch = useDispatch();
    const sessionUser = useSelector((state) => state.session.user);
  
    const [name, setName] = useState(channel.name);
    const [errors, setErrors] = useState([]);
    const { closeModal } = useModal();
  
    const updateName = (e) => setName(e.target.value);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      const payload = {
        name,
        serverId,
        id: channel.id
      };
  
      const editedChannel = await dispatch(editChannelThunk(payload))

      if (!editedChannel.id) {
        setErrors(editedChannel);
      } else {
        closeModal()
      }
    };
  
    return sessionUser.id ? (
      <form onSubmit={handleSubmit}>
        <ul>
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
        <div className="edit-channel-modal">
          <p>Overview</p>
          <input
            type="text"
            placeholder={name}
            value={name}
            onChange={updateName}
            required
          />
  
          <div>
            <button className="edit-channel-button" type="submit">
              Save
            </button>
          </div>
        </div>
      </form>
    ) : null;
  };
  
  export default EditChannelForm;