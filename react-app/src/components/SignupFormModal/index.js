import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { signUp } from "../../store/session";
import { useHistory } from "react-router-dom";
import ImageUpload from "../ImageUpload";
import "./SignupForm.css";

function SignupFormModal() {
	const dispatch = useDispatch();
	const [image, setImage] = useState("");
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [errors, setErrors] = useState([]);
	const [formSubmitted, setFormSubmitted] = useState(false);
	const [imageUploaded, setImageUploaded] = useState(false);
	const { closeModal } = useModal();
	const history = useHistory();

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (password === confirmPassword) {
			const data = await dispatch(signUp(username, email, password, image));
			if (data) {
				setErrors(data);
			} else {
				closeModal();
				history.push(`/@me`);
			}
		} else {
			setErrors([
				"Confirm Password field must be the same as the Password field",
			]);
		}
	};

	if (formSubmitted) {
		setImageUploaded(false);
	  };

	// To do: Redirect to a server after signing up (homepage)
  // ^ until you have DMs then send them to DMs

	return (
		<>
			<h1>Sign Up</h1>
			<ImageUpload setImage={setImage} formSubmitted={formSubmitted} imageUploaded={imageUploaded} setImageUploaded={setImageUploaded} />
			<form onSubmit={handleSubmit}>
				<ul>
					{errors.map((error, idx) => (
						<li key={idx}>{error}</li>
					))}
				</ul>
				<label>
					Email
					<input
						type="text"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
				</label>
				<label>
					Username
					<input
						type="text"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						required
					/>
				</label>
				<label>
					Password
					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</label>
				<label>
					Confirm Password
					<input
						type="password"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						required
					/>
				</label>
				<button type="submit">Sign Up</button>
			</form>
		</>
	);
}

export default SignupFormModal;