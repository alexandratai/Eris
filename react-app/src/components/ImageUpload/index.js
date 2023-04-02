import React, { useState } from "react";
import "./ImageUpload.css";

const ImageUpload = ({ setImage }) => {
  const [photo, setPhoto] = useState("");
  const [imageLoading, setImageLoading] = useState(false);
  const [imageUploaded, setImageUploaded] = useState(false);
  //   const [previewImage, setPreviewImage] = useState("");
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
    handleSubmit(file);
  };

  return (
    <>
      {imageUploaded ? (
        <>
          <div>
            <img src={photo} className="image-uploaded-photo-preview" />
            <br></br>
            <button onClick={() => document.getElementById("file").click()}>
              {" "}
              Change Image
            </button>
          </div>
        </>
      ) : (
        <div>
          <button onClick={() => document.getElementById("file").click()}>
            <i
              className="fa-solid fa-camera fa-3x"
              style={{ marginTop: "5px" }}
            ></i>
            <div>
              <h1>Upload</h1>
            </div>
          </button>
        </div>
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

export default ImageUpload;
