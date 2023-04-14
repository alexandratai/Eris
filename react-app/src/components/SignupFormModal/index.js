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
		<div className="sign-up-modal-overall-div">
			<p className="sign-up-modal-sign-up">Sign Up</p>
			<ImageUpload setImage={setImage} formSubmitted={formSubmitted} imageUploaded={imageUploaded} setImageUploaded={setImageUploaded} />
			<form onSubmit={handleSubmit} className="sign-up-modal-form">
				<ul className="sign-up-modal-errors">
					{errors.map((error, idx) => (
						<li key={idx}>{error}</li>
					))}
				</ul>
				<label>
					Email
					<br></br>
					<input
						type="text"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						className="sign-up-modal-input"
					/>
				</label>
				<label>
					Username<br></br>
					<input
						type="text"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						required
						className="sign-up-modal-input"
					/>
				</label>
				<label>
					Password<br></br>
					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
						className="sign-up-modal-input"
					/>
				</label>
				<label>
					Confirm Password<br></br>
					<input
						type="password"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						required
						className="sign-up-modal-input"
					/>
				</label>
				<button type="submit">Sign Up</button>
			</form>
		</div>
	);
}

export default SignupFormModal;