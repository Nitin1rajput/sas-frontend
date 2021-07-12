import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
  VALIDATOR_EMAIL,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import { MultipleImageUpload } from "../../shared/components/FormElements/ImageUpload";
import "./StudentForm.css";

const NewStudent = () => {
  const auth = useContext(AuthContext);
  const { error, isLoading, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler] = useForm(
    {
      name: {
        value: "",
        isValid: false,
      },
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
      standard: {
        value: "",
        isValid: false,
      },
      images: {
        value: {},
        isValid: false,
      },
    },
    false
  );
  const history = useHistory();
  const placeSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append("email", formState.inputs.email.value);
      formData.append("name", formState.inputs.name.value);
      formData.append("password", formState.inputs.password.value);
      formData.append("standard", formState.inputs.standard.value);
      for (let i = 0; i < formState.inputs.images.value.length; i++) {
        formData.append("images", formState.inputs.images.value[i]);
      }

      await sendRequest(
        "http://localhost:5000/api/students/new",
        "POST",
        formData,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      history.push("/");
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form className="place-form" onSubmit={placeSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <Input
          id="name"
          element="input"
          type="text"
          label="Name"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid title."
          onInput={inputHandler}
        />
        <Input
          id="email"
          element="input"
          label="Email"
          type="email"
          validators={[VALIDATOR_EMAIL()]}
          errorText="Please enter a valid email"
          onInput={inputHandler}
        />
        <Input
          id="password"
          element="input"
          label="Password"
          type="password"
          validators={[VALIDATOR_MINLENGTH(6)]}
          errorText="Please enter a valid password upto 6 characters"
          onInput={inputHandler}
        />
        <Input
          id="standard"
          element="input"
          label="Standard"
          type="number"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid stanard."
          onInput={inputHandler}
        />

        <MultipleImageUpload
          id="images"
          center
          onInput={inputHandler}
          errorText="Input valid images"
        />

        <Button type="submit" disabled={!formState.isValid}>
          ADD STUDENT
        </Button>
      </form>
    </React.Fragment>
  );
};

export default NewStudent;
