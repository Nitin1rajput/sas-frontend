import React, { useRef, useState, useEffect } from "react";
import Button from "./Button";
import "./ImageUpload.css";

const SingleImageUpload = (props) => {
  const filePickerRef = useRef();
  const [preview, setPreview] = useState();
  const [isValid, setIsValid] = useState(false);
  const [file, setFile] = useState();

  useEffect(() => {
    if (!file) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreview(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }, [file]);
  const pickedHandler = (e) => {
    let pickedFile;
    let fileIsValid = isValid;
    if (e.target.files && e.target.files.length !== 0) {
      pickedFile = e.target.files[0];
      setFile(pickedFile);
      setIsValid(true);
      fileIsValid = true;
    } else {
      setIsValid(false);
      fileIsValid = false;
    }
    props.onInput(props.id, pickedFile, fileIsValid);
  };
  const pickImageHandler = () => {
    filePickerRef.current.click();
  };
  return (
    <div className="form-control">
      <input
        id={props.id}
        ref={filePickerRef}
        style={{ display: "none" }}
        type="file"
        accept=".jpg,.png,.jpeg"
        onChange={pickedHandler}
      />

      <div className={`image-upload ${props.center && "center"}`}>
        <div className="image-upload__preview">
          {preview && <img src={preview} alt="Preview" />}
          {!preview && <p>Please pick an image</p>}
        </div>
      </div>
      <Button type="button" onClick={pickImageHandler}>
        PICK IMAGE
      </Button>
      {!isValid && <p>{props.errorText}</p>}
    </div>
  );
};
const MultipleImageUpload = (props) => {
  const filePickerRef = useRef();
  const [isValid, setIsValid] = useState(false);
  const [files, setFiles] = useState({});

  const pickedHandler = (e) => {
    let pickedFile;
    let fileIsValid = isValid;
    if (e.target.files && e.target.files.length !== 0) {
      pickedFile = e.target.files;
      setFiles(pickedFile);
      setIsValid(true);
      fileIsValid = true;
    } else {
      setIsValid(false);
      fileIsValid = false;
    }
    props.onInput(props.id, pickedFile, fileIsValid);
  };
  const pickImageHandler = () => {
    filePickerRef.current.click();
  };
  return (
    <div className="form-control">
      <input
        id={props.id}
        ref={filePickerRef}
        style={{ display: "none" }}
        type="file"
        accept=".jpg,.png,.jpeg"
        onChange={pickedHandler}
        multiple
      />
      <div className={`image-upload `}>
        {files && <p>Images Upload: {files.length}</p>}
        {!files && <p>Please pick an image</p>}
      </div>

      <Button type="button" onClick={pickImageHandler}>
        PICK IMAGE
      </Button>
      {!isValid && <p>{props.errorText}</p>}
    </div>
  );
};
export { SingleImageUpload, MultipleImageUpload };
