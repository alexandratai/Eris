import "./EditServerForm.css";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { allUserServersThunk } from "../../store/servers";
import { editServerThunk } from "../../store/servers";
import { useModal } from "../../context/Modal";
import { useHistory } from "react-router-dom";
import ImageUpload from "../ImageUpload";

const EditServerForm = ({ server }) => {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const history = useHistory();

  const [name, setName] = useState(server.name);
  const [image, setImage] = useState(server.image);
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();
  const [imageUploaded, setImageUploaded] = useState(false);

  const updateName = (e) => setName(e.target.value);

  useEffect(() => {
    dispatch(allUserServersThunk());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name,
      image,
      id: server.id,
    };

    const editedServer = await dispatch(editServerThunk(payload));
    if (!editedServer.id) {
      setErrors(editedServer);
    } else {
      closeModal();
      history.push(`/${editedServer.id}`);
    }
  };

  return sessionUser.id ? (
    <div className="edit-server-form-overall-div" style={{opacity: "90%"}}>
      <ImageUpload setImage={setImage} imageUploaded={imageUploaded} setImageUploaded={setImageUploaded} />
      <form onSubmit={handleSubmit}>
        <ul>
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>

        <div className="edit-server-modal">
          <p className="edit-server-modal-title">Edit a Server:</p>
          <input
            type="text"
            placeholder="Server name here"
            value={name}
            onChange={updateName}
            required
          />

          <br></br>

          <div>
            <button className="edit-server-button" type="submit">
              Edit Server
            </button>
          </div>
        </div>
      </form>
    </div>
  ) : null;
};

export default EditServerForm;
