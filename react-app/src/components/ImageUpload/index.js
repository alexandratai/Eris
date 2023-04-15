import React, { useState, useEffect } from "react";
import "./ImageUpload.css";

const ImageUpload = ({ setImage, formSubmitted, imageUploaded, setImageUploaded }) => {
  const [photo, setPhoto] = useState("");
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
      {imageUploaded && !formSubmitted ? (
        <>
          <div className="image-upload-preview-and-button-div">
            <img src={photo} className="image-uploaded-photo-preview" />
            <br></br>
            {imageLoading && <p className="image-uploaded-loading">Loading...</p>}
            <div>
            <button onClick={() => document.getElementById("newImg").click()}>
              {" "}
              Change Image
            </button>
            <button className="image-upload-remove-image-button" onClick={handleRemoveImage}>Remove Image</button>
            </div>
          </div>
        </>
      ) : (
        <div>
          {imageLoading && <p className="image-uploaded-loading">Loading...</p>}
          <button onClick={() => document.getElementById("newImg").click()} className="image-uploaded-upload-image-button">
            <i
              className="fa-solid fa-camera fa-3x"
              id="image-upload-camera-button"
              ></i>
            <div>
              <p>Upload Image</p>
            </div>
          </button>
        </div>
      )}

      {formSubmitted && imageUploaded && <></>}

      <ul>
        {errors.map((error, idx) => (
          <li key={idx}>{error}</li>
        ))}
      </ul>

      <div>
        <input
          type="file"
          accept="image/*"
          onChange={updateImage}
          style={{ display: "none" }}
          id="newImg"
          />
      </div>
    </>
  );
};

export default ImageUpload;
