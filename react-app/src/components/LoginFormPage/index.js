import React, { useState } from "react";
import { login } from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { useHistory } from "react-router-dom";
import './LoginForm.css';

function LoginFormPage() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const history = useHistory();

  if (sessionUser) return <Redirect to="/@me" />;
  // if (sessionUser == null) return <Redirect to="/" />; // PUT THIS BACK IN AFTER YOU STYLE THIS PAGE

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await dispatch(login(email, password));
    if (data) {
      setErrors(data);
    }

    history.push(`/@me`);
  };

  return (
    <>
      <h1 className="login-form-log-in-text">Log In</h1>
      <form onSubmit={handleSubmit}>
        <ul>
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
        <label className="login-form-page-label">
          Email
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="login-form-page-input"
          />
        </label>
        <label className="login-form-page-label">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="login-form-page-input"
          />
        </label>
        <button type="submit" className="login-form-page-button">Log In</button>
      </form>
    </>
  );
}

export default LoginFormPage;
