import { useCallback, useReducer } from "react";

//form reducer function:
const formReducer = (state, action) => {
  switch (action.type) {
    case "INPUT-CHANGE":
      let formIsValid = true;
      //checking if all inputs in form are valid:
      for (const inputId in state.inputs) {
        //skip property if it is undefined:
        if (!state.inputs[inputId]) {
          continue;
        }
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

    //setting up initial data when form is rendered:
    case "SET-DATA":
      return { inputs: action.inputs, isValid: action.formIsValid };

    //seeting up default case:
    default:
      return state;
  }
};

export default function useForm(initialInputs, initialFormValidity) {
  //Managing states of both inputs:
  const [formState, dispatch] = useReducer(formReducer, {
    inputs: initialInputs,
    isValid: initialFormValidity,
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

  const setFormData = useCallback((inputData, formValidity) => {
    dispatch({
      type: "SET-DATA",
      inputs: inputData,
      formIsValid: formValidity,
    });
  }, []);

  return [formState, inputHandler, setFormData];
}
