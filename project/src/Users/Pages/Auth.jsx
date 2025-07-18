import useForm from "../../Shared/Hooks/Form-hook";
import "./Auth.css";
import Card from "./../../Shared/Components/UI-Elements/Card";
import Input from "../../Shared/Components/FormElements/Input";
import Button from "../../Shared/Components/FormElements/Button";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../Shared/Util/Validators";
import { useState, useContext } from "react";
import AuthContext from "../../Shared/Context/Auth-context.js";
import ErrorModal from "../../Shared/Components/UI-Elements/ErrorModal";
import LoadingSpinner from "../../Shared/Components/UI-Elements/LoadingSpinner";

export default function Authenticate(props) {
  //using context hook:
  const auth = useContext(AuthContext);

  //managing state for switching mode:
  const [isLoginMode, setIsLoginMode] = useState(false);

  //managing states for loading and errors:
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState();
  //using custom hook:
  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  //submission handler function:
  const authSubmitHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    //sending request to backend:

    //LOG IN
    if (isLoginMode) {
      try {
        const response = await fetch("http://localhost:5000/api/users/login", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
        });

        const responseData = await response.json(); //parse response

        if (!response.ok) {
          // res => 400/500
          throw new Error(responseData.message);
        }

        setIsLoading(false);
        auth.login(); // log in
      } catch (error) {
        console.log(error);
        setIsLoading(false);
        setIsError(error.message || "Something went wrong");
      }
    }

    //SIGN UP:
    else {
      try {
        const response = await fetch("http://localhost:5000/api/users/signup", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            name: formState.inputs.name.value,
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
        });

        const responseData = await response.json(); //parse response

        if (!response.ok) {
          // res => 400/500
          throw new Error(responseData.message);
        }

        setIsLoading(false);
        auth.login(); // log in
      } catch (error) {
        console.log(error);
        setIsLoading(false);
        setIsError(error.message || "Something went wrong");
      }
    }
  };

  //switch mode handler:
  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: "",
            isValid: false,
          },
        },
        false
      );
    }
    setIsLoginMode((prev) => !prev);
  };

  const onClear = () => {
    setIsError(null);
  };

  //returning UI:
  return (
    <>
      <ErrorModal error={isError} onClear={onClear} />
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>Log in required</h2>
        <hr />
        <form onSubmit={authSubmitHandler}>
          {!isLoginMode && (
            <Input
              element="input"
              id="name"
              type="text"
              label="Your Name"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter your name"
              onInput={inputHandler}
            />
          )}
          <Input
            element="input"
            id="email"
            type="email"
            label="E-Mail"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter a valid email"
            onInput={inputHandler}
          />
          <Input
            element="input"
            id="password"
            type="password"
            label="Password"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid password(At least 5 characters)"
            onInput={inputHandler}
          />
          <Button type="submit" disabled={!formState.isValid}>
            {isLoginMode ? "LOG IN" : "SIGN UP"}
          </Button>
        </form>
        <Button inverse onClick={switchModeHandler}>
          SWITCH TO {isLoginMode ? "SIGN UP" : "LOG IN"}
        </Button>
      </Card>
    </>
  );
}
