import "./NewPlaces.css";
import { useCallback, useReducer } from "react";
import Input from "../../Shared/Components/FormElements/Input";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../Shared/Util/Validators";
import Button from "../../Shared/Components/FormElements/Button";

//form reducer function:
const formReducer = (state, action) => {
  switch (action.type) {
    case "INPUT-CHANGE":
      let formIsValid = true;
      //checking if all inputs in form are valid:
      for (const inputId in state.inputs) {
        if (inputId === action.inputId) {
          //combining prev value of formIsValid with actual isValid so that if one will be false,
          //overall will become false too
          formIsValid = formIsValid && action.isValid;
        } else {
          formIsValid = formIsValid && state.inputs[inputId].isValid;
        }
      }
      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.inputId]: { value: action.value, isValid: action.isValid },
        },
        isValid: formIsValid,
      };

    default:
      return state;
  }
};

export default function NewPlaces() {
  //Managing states of both inputs:
  const [formState, dispatch] = useReducer(formReducer, {
    inputs: {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
    },
    isValid: false,
  });

  // change handler for input fields:
  const inputHandler = useCallback((id, value, isValid) => {
    dispatch({
      type: "INPUT-CHANGE",
      value: value,
      isValid: isValid,
      inputId: id,
    });
  }, []);

  //submission handler:
  const submissionHandler = (e) => {
    e.preventDefault();
    console.log(formState.inputs); //send this to the backend
  };

  //returning ui:
  return (
    <form className="place-form" onSubmit={submissionHandler}>
      <Input
        id="title"
        element="input"
        type="text"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="please enter a valid title"
        onInput={inputHandler}
      />
      <Input
        id="description"
        element="textarea"
        type="text"
        label="description"
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText="please enter a valid description (at least 5 characters)"
        onInput={inputHandler}
      />
      <Input
        id="address"
        element="input"
        type="text"
        label="address"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="please enter a valid address" //later check if address exist on the backend
        onInput={inputHandler}
      />
      <Button type="submit" disabled={!formState.isValid}>
        Add Place
      </Button>
    </form>
  );
}
