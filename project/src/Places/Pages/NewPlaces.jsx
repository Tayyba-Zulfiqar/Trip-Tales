import "./PlaceForm.css";

import Input from "../../Shared/Components/FormElements/Input";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../Shared/Util/Validators";
import Button from "../../Shared/Components/FormElements/Button";
import useForm from "../../Shared/Hooks/Form-hook";
import useHttpClient from "../../Shared/Hooks/http-hook.js";
import { useContext } from "react";
import AuthContext from "../../Shared/Context/Auth-context.js";
import ErrorModal from "../../Shared/Components/UI-Elements/ErrorModal";
import LoadingSpinner from "../../Shared/Components/UI-Elements/LoadingSpinner";
import { useHistory } from "react-router-dom";
import ImageUpload from "../../Shared/Components/FormElements/ImageUpload";

export default function NewPlaces() {
  const auth = useContext(AuthContext);
  //calling http custom hook:
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
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
      image: {
        value: null,
        isValid: false,
      },
    },
    false
  );

  const history = useHistory(); // allows us to redirect to certain page after task completion

  //submission handler:
  const submissionHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", formState.inputs.title.value);
      formData.append("description", formState.inputs.description.value);
      formData.append("address", formState.inputs.address.value);
      formData.append("creator", auth.userId);
      formData.append("image", formState.inputs.image.value);
      console.log("AUTH TOKEN BEING SENT:", auth.token);

      await sendRequest(
        "http://localhost:5000/api/places",
        "POST",
        {
          Authorization: "Bearer " + auth.token,
        },
        formData
      );

      history.push("/");
    } catch (error) {}
  };

  //returning ui:
  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <form className="place-form" onSubmit={submissionHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
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
        <ImageUpload
          id="image"
          onInput={inputHandler}
          errorText="Please provide an image"
        />
        <Button type="submit" disabled={!formState.isValid}>
          Add Place
        </Button>
      </form>
    </>
  );
}
