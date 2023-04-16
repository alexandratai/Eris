import React, { useState, useRef } from "react";
import "./MessageImageUpload.css";

const MessageImageUpload = ({
  setImage,
  formSubmitted,
  isEditing = false,
  image,
  imageUploaded,
  setImageUploaded,
}) => {
  const [photo, setPhoto] = useState(image);
  const [imageLoading, setImageLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const ref = useRef();

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
    // const file = e.target.files[0];
    const file = ref.current.files[0];
    if (!file) {
      return;
    } // If you click cancel, it will not throw an error
    handleSubmit(file);
  };

  return (
    <>
      {imageUploaded && !formSubmitted ? (
        <>
          <div
            className={
              isEditing || imageUploaded
                ? "message-image-uploaded-with-edit-button-div-for-editing"
                : "message-image-uploaded-with-edit-button-div"
            }
          >
            {photo && (
              <img
                src={photo}
                className="message-image-uploaded-photo-preview"
              />
            )}
            <br></br>
            <div
              className={
                photo &&
                "message-image-uploaded-with-edit-button-for-message-edit"
              }
            >
              <button
                className="message-image-upload-edit-button"
                onClick={() => ref.current.click()}
              >
                {" "}
                Edit Image
              </button>
              <button onClick={handleRemoveImage}>Remove Image</button>
            </div>
          </div>
        </>
      ) : (
        <div>
          {image && (
            <img src={image} className="message-image-uploaded-photo-preview" />
          )}
          <br></br>
          <div className="message-image-upload-editing-buttons-overall-div">
            {isEditing && image ? (
              <>
                <button
                  className="message-image-upload-edit-button"
                  onClick={() => ref.current.click()}
                >
                  {" "}
                  Edit Image
                </button>
                <button onClick={handleRemoveImage}>Remove Image</button>
              </>
            ) :
            <button
              className="message-image-upload-plus-sign"
              onClick={() => ref.current.click()}
            ><i className="fa-sharp fa-solid fa-plus"></i></button>}
          </div>
        </div>
      )}

      {formSubmitted && imageUploaded && <></>}

      <ul>
        {errors.map((error, idx) => (
          <li key={idx}>{error}</li>
        ))}
      </ul>
      {imageLoading && (
        <p className="message-image-upload-loading-text">Loading...</p>
      )}

      <div>
        <input
          type="file"
          accept="image/*"
          onChange={updateImage}
          style={{ display: "none" }}
          ref={ref}
          id="file"
        />
      </div>
    </>
  );
};

export default MessageImageUpload;
