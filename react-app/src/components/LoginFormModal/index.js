import React, { useState } from "react";
import { login } from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { useHistory } from "react-router-dom";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await dispatch(login(email, password));
    if (data) {
      setErrors(data);
    } else {
      closeModal();
      history.push(`/@me`);
    }
  };

  // To do: Redirect to a server after logging in (homepage)
  // ^ until you have DMs then send them to DMs

  return (
    <div className="flex items-center justify-center h-screen bg-indigo-600" id="login-form-modal-overall-div">
      <div className="p-6 bg-white w-96 shadow-1g round-md">
        <p className="login-log-in-text">Log In</p>
        <form onSubmit={handleSubmit} className="login-server-modal">
          <ul>
            {errors.map((error, idx) => (
              <li key={idx}>{error}</li>
            ))}
          </ul>
          <label htmlFor="email" className="block mb-2 text-base" id="login-email-password-label-text">
            Email
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="login-input-box"
            />
          </label>
          <label id="login-email-password-label-text">
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="login-input-box"
            />
          </label>
          <button type="submit">Log In</button>
        </form>
      </div>
    </div>
  );
}

export default LoginFormModal;
