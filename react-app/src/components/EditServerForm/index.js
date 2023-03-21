import "./EditServerForm.css";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { allUserServersThunk } from "../../store/servers";
import { editServerThunk } from "../../store/servers";
import { useModal } from "../../context/Modal";
import { useHistory } from "react-router-dom";

const EditServerForm = ({ server }) => {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const history = useHistory();

  const [name, setName] = useState(server.name);
  const [image, setImage] = useState(server.image);
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

  const updateName = (e) => setName(e.target.value);
  const updateImage = (e) => setImage(e.target.value);

  useEffect(() => {
    dispatch(allUserServersThunk())
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name,
      image,
      id: server.id
    };

    console.log("#####", payload)

    const editedServer = await dispatch(editServerThunk(payload));
    console.log("@@@@@@", editedServer)
    if (!editedServer.id) {
      setErrors(editedServer);
    } else {
      closeModal();
      history.push(`/${editedServer.id}`)
    }
  };

  return sessionUser.id ? (
    <form onSubmit={handleSubmit}>
      <ul>
        {errors.map((error, idx) => (
          <li key={idx}>{error}</li>
        ))}
      </ul>

      <div className="edit-server-modal">
        <p>Edit a Server:</p>
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
          <button className="edit-server-button" type="submit">
            Edit Server
          </button>
        </div>
      </div>
    </form>
  ) : null;
};

export default EditServerForm;
