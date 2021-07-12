import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import { VALIDATOR_REQUIRE } from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";

import "./StudentForm.css";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";

const UpdateStudent = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedStudent, setLoadedStudents] = useState();
  const studentId = useParams().sid;

  const [formState, inputHandler, setFormData] = useForm(
    {
      name: {
        value: "",
        isValid: false,
      },
      standard: {
        value: "",
        isValid: false,
      },
      images: {
        value: "",
        isValid: false,
      },
    },
    false
  );
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const data = await sendRequest(
          `http://localhost:5000/api/students/${studentId}`
        );
        setLoadedStudents(data.student);
        setFormData(
          {
            name: {
              value: data.title,
              isValid: true,
            },
            standard: {
              value: data.description,
              isValid: true,
            },
            images: {
              value: data.images,
              isValid: true,
            },
          },
          true
        );
      } catch (err) {}
    };
    fetchStudent();
  }, [sendRequest, studentId, setFormData]);
  const history = useHistory();

  const placeUpdateSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      await sendRequest(
        `http://localhost:5000/api/students/${studentId}`,
        "PATCH",
        JSON.stringify({
          name: formState.inputs.name.value,
          standard: formState.inputs.standard.value,
          images: formState.inputs.images.value,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      history.push("/students");
    } catch (err) {}
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner asOverlay />
      </div>
    );
  }
  if (!loadedStudent && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find place!</h2>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedStudent && (
        <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
          <Input
            id="name"
            element="input"
            type="text"
            label="Name"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid title."
            onInput={inputHandler}
            initialValue={loadedStudent.name}
            initialValid={true}
          />
          <Input
            id="standard"
            element="input"
            label="Standard"
            type="number"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid stanard."
            onInput={inputHandler}
            initialValue={loadedStudent.standard}
            initialValid={true}
          />
          <Input
            id="images"
            element="input"
            label="Images"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid Image."
            onInput={inputHandler}
            initialValue={loadedStudent.images}
            initialValid={true}
          />

          <Button type="submit" disabled={!formState.isValid}>
            UPDATE PLACE
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default UpdateStudent;
