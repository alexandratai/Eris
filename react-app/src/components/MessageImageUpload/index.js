import React, { useState } from "react";
import "./MessageImageUpload.css";

const MessageImageUpload = ({ setImage, formSubmitted, isEditing = false }) => {
  const [photo, setPhoto] = useState("");
  const [imageLoading, setImageLoading] = useState(false);
  const [imageUploaded, setImageUploaded] = useState(false);
  const [errors, setErrors] = useState([]);

  const handleSubmit = async (image) => {
    const formData = new FormData();

    setImageLoading(true);

    formData.append("image", image);
    const res = await fetch("/api/images/", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const img = await res.json();
      setImageLoading(false);
      setImage(img.url);
      setImageUploaded(true);
      setPhoto(img.url);
    } else if (res.status < 500) {
      setImageLoading(false);

      const error = [];
      error.push("Could not upload file correctly.");
      window.alert(error[0]);
    }
  };

  const updateImage = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (!file) {
      return;
    } // If you click cancel, it will not throw an error
    handleSubmit(file);
  };

  return (
    <>
      {imageUploaded && !formSubmitted ? (
        <>
          <div>
            <img src={photo} className="image-uploaded-photo-preview" />
            <br></br>
            <button onClick={() => document.getElementById("file").click()}>
              {" "}
              Edit Image
            </button>
          </div>
        </>
      ) : (
        <div>
          <button onClick={() => document.getElementById("file").click()}>
          {isEditing ? "Edit Image" : <i className="fa-sharp fa-solid fa-plus"></i>}
          </button>
        </div>
      )}

      {formSubmitted && imageUploaded && (
        <></>
      )}

      <ul>
        {errors.map((error, idx) => (
          <li key={idx}>{error}</li>
        ))}
      </ul>
      {imageLoading && <p>Loading...</p>}

      <div>
        <input
          type="file"
          accept="image/*"
          onChange={updateImage}
          style={{ display: "none" }}
          id="file"
        />
      </div>
    </>
  );
};

export default MessageImageUpload;