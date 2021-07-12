import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import { VALIDATOR_REQUIRE } from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";

import "./FacultyForm.css";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { SingleImageUpload } from "../../shared/components/FormElements/ImageUpload";

const UpdateFaculty = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedFaculty, setLoadedFaculty] = useState();
  const facultyId = useParams().fid;

  const [formState, inputHandler, setFormData] = useForm(
    {
      name: {
        value: "",
        isValid: false,
      },
      standard: {
        value: undefined,
        isValid: false,
      },
      image: {
        value: null,
        isValid: false,
      },
    },
    false
  );

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const data = await sendRequest(
          `http://localhost:5000/api/faculty/${facultyId}`
        );
        setLoadedFaculty(data.faculty);
        setFormData(
          {
            name: {
              value: data.name,
              isValid: true,
            },
            standard: {
              value: data.standard,
              isValid: true,
            },
            image: {
              value: data.image,
              isValid: true,
            },
          },
          true
        );
      } catch (err) {}
    };
    fetchStudent();
  }, [sendRequest, facultyId, setFormData]);
  const history = useHistory();

  const placeUpdateSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", formState.inputs.name.value);
      formData.append("standard", formState.inputs.standard.value);
      formData.append("image", formState.inputs.image.value);
      await sendRequest(
        `http://localhost:5000/api/faculty/${facultyId}`,
        "PATCH",
        formData,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      history.push("/");
    } catch (err) {}
  };
  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner asOverlay />
      </div>
    );
  }
  if (!loadedFaculty && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find Faculty!</h2>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedFaculty && (
        <form className="faculty-form" onSubmit={placeUpdateSubmitHandler}>
          <Input
            id="name"
            element="input"
            type="text"
            label="Name"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid title."
            onInput={inputHandler}
            initialValue={loadedFaculty.name}
            initialValid={true}
          />

          <SingleImageUpload
            id="image"
            center
            onInput={inputHandler}
            errorText="Please provide a valid image"
          />

          <Input
            element="input"
            type="number"
            id="standard"
            label="Standard"
            validators={[VALIDATOR_REQUIRE()]}
            onInput={inputHandler}
            initialValue={loadedFaculty.standard}
            initialValid={true}
          />
          <Button type="submit" disabled={!formState.isValid}>
            UPDATE PROFILE
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default UpdateFaculty;
