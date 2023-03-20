import "./CreateServerForm.css";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeServerThunk } from "../../store/servers";
import { useModal } from "../../context/Modal";
import { useHistory } from "react-router-dom";

const CreateServerForm = ({ serverId }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const sessionUser = useSelector((state) => state.session.user);

  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

  const updateName = (e) => setName(e.target.value);
  const updateImage = (e) => setImage(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name,
      image
    };

    const createdServer = await dispatch(makeServerThunk(serverId, payload));
    if (!createdServer.id) {
      setErrors(createdServer);
    } else {
      closeModal();
    }
  };

  return sessionUser.id ? (
    <form onSubmit={handleSubmit}>
      <ul>
        {errors.map((error, idx) => (
          <li key={idx}>{error}</li>
        ))}
      </ul>

      <div className="create-server-modal">
      <p>Add a Server:</p>
      <input
        type="text"
        placeholder="Server name here"
        value={name}
        onChange={updateName}
        required
      />
      
      <br></br>
      <input
        type="text"
        placeholder="Image url here"
        value={image}
        onChange={updateImage}
        required
      />

      <div>
        <button className="create-server-button" type="submit">
          Add New Server
        </button>
      </div>
    </div>

    </form>
  ) : null;
};

export default CreateServerForm;
