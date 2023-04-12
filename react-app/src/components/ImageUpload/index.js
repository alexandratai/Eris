import React, { useState, useEffect } from "react";
import "./ImageUpload.css";

const ImageUpload = ({ setImage, formSubmitted, imageUploaded, setImageUploaded }) => {
  const [photo, setPhoto] = useState("");
  // const [img, setImg] = useState("");
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

  // useEffect(() => {
  //   if (img) {
      const updateImage = async (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        if (!file) {
          return;
        } // If you click cancel, it will not throw an error
        handleSubmit(file);
      };

      // updateImage();
  //   }
  // }, [img]);

  return (
    <>
      {imageUploaded && !formSubmitted ? (
        <>
          <div>
            <img src={photo} className="image-uploaded-photo-preview" />
            <br></br>
            <button onClick={() => document.getElementById("newImg").click()}>
              {" "}
              Change Image
            </button>
          </div>
        </>
      ) : (
        <div>
          <button onClick={() => document.getElementById("newImg").click()} className="image-uploaded-upload-image-button">
            <i
              className="fa-solid fa-camera fa-3x"
              style={{ marginTop: "7px" }}
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
      {imageLoading && <p>Loading...</p>}

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
