import "./PlaceForm.css";

import Input from "../../Shared/Components/FormElements/Input";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../Shared/Util/Validators";
import Button from "../../Shared/Components/FormElements/Button";
import useForm from "../../Shared/Hooks/Form-hook";

export default function NewPlaces() {
  //calling useForm custon hook:
  const [formState, inputHandler] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      address: {
        value: "",
        isValid: false,
      },
    },
    false
  );

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
