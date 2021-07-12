import React from "react";
import { useHistory } from "react-router-dom";

import Card from "../../shared/components/UIElements/Card";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import "./Auth.css";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { SingleImageUpload } from "../../shared/components/FormElements/ImageUpload";

const Auth = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

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
        value: undefined,
        isValid: false,
      },
    },
    false
  );

  let history = useHistory();
  const authSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();

      formData.append("name", formState.inputs.name.value);
      formData.append("email", formState.inputs.email.value);
      formData.append("password", formState.inputs.password.value);
      formData.append("standard", formState.inputs.standard.value);
      formData.append("image", formState.inputs.image.value);

      await sendRequest(
        "http://localhost:5000/api/faculty/signup",
        "POST",
        formData
      );
      // const data = await sendRequest(
      //   "http://localhost:5000/api/faculty/signup",
      //   "POST",
      //   JSON.stringify({
      //     name: formState.inputs.name.value,
      //     email: formState.inputs.email.value,
      //     password: formState.inputs.password.value,
      //     subjects: subjects,
      //   }),
      //   {
      //     "Content-Type": "application/json",
      //   }
      //   // formData
      // );
    } catch (error) {}

    history.push("/");
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>Signup</h2>
        <hr />
        <form onSubmit={authSubmitHandler}>
          <Input
            element="input"
            id="name"
            type="text"
            label="Name"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid email address."
            onInput={inputHandler}
          />
          <Input
            element="input"
            id="email"
            type="email"
            label="E-Mail"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter a valid email address."
            onInput={inputHandler}
          />
          <Input
            element="input"
            id="password"
            type="password"
            label="Password"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid password, at least 5 characters."
            onInput={inputHandler}
          />
          <SingleImageUpload
            id="image"
            onInput={inputHandler}
            center
            errorText="Please provide valid image"
          />
          <Input
            element="input"
            id="standard"
            type="number"
            label="Standard"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid standard"
            onInput={inputHandler}
          />

          <Button type="submit" disabled={!formState.isValid}>
            SIGNUP
          </Button>
        </form>
      </Card>
    </React.Fragment>
  );
};

export default Auth;
