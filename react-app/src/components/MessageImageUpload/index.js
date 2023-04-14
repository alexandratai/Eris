import React, { useState } from "react";
import "./MessageImageUpload.css";

const MessageImageUpload = ({ setImage, formSubmitted, isEditing = false, image, imageUploaded, setImageUploaded }) => {
  const [photo, setPhoto] = useState(image);
  const [imageLoading, setImageLoading] = useState(false);
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

  const handleRemoveImage = async () => {
    setPhoto(null);
    setImage(null);
    setImageUploaded(false);
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
      {(imageUploaded || photo) && !formSubmitted ? (
        <>
          <div className={imageUploaded ? "image-uploaded-with-edit-button-div" : "image-uploaded-with-edit-button-for-message-div"}>
            {photo && <img src={photo} className="image-uploaded-photo-preview" />}
            <br></br>
            <div className={photo && "image-uploaded-with-edit-button-for-message-edit"}>
            <button onClick={() => document.getElementById("file").click()}>
              {" "}
              Edit Image
            </button>
            <button onClick={handleRemoveImage}>Remove Image</button>
            </div>
          </div>
        </>
      ) : (
        <div>
          {image && <img src={image} className="image-uploaded-photo-preview" />}
          <br></br>
          <button className="message-image-upload-plus-sign" onClick={() => document.getElementById("file").click()}>
          {(isEditing && imageUploaded) ? "Edit Image" : <i className="fa-sharp fa-solid fa-plus"></i>}
          </button>
        </div>
      )}

      {formSubmitted && imageUploaded && (
        <>
        </>
      )}

      <ul>
        {errors.map((error, idx) => (
          <li key={idx}>{error}</li>
        ))}
      </ul>
      {imageLoading && <p className="message-image-upload-loading-text">Loading...</p>}

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