import { useParams, useHistory } from "react-router-dom";
import Input from "../../Shared/Components/FormElements/Input";
import Button from "../../Shared/Components/FormElements/Button";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../Shared/Util/Validators";
import "./PlaceForm.css";
import Card from "../../Shared/Components/UI-Elements/Card";

import { useEffect, useState, useContext } from "react";
import useForm from "../../Shared/Hooks/Form-hook";
import useHttpClient from "../../Shared/Hooks/http-hook.js";
import LoadingSpinner from "../../Shared/Components/UI-Elements/LoadingSpinner";
import ErrorModal from "../../Shared/Components/UI-Elements/ErrorModal";
import AuthContext from "../../Shared/Context/Auth-context.js";

export default function UpdatePlace(props) {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [loadedPlace, setLoadedPlace] = useState();
  const history = useHistory();
  //getting id from params:
  const placeId = useParams().placeId;

  //setting up initial data for useForm custom hook:
  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  //Fetching place from backend:
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/places/${placeId}`
        );
        setLoadedPlace(responseData.place);

        //updating place:
        setFormData({
          title: { value: responseData.place.title, isValid: true },
          description: { value: responseData.place.description, isValid: true },
        });
      } catch (err) {}
    };
    fetchPlaces();
  }, [sendRequest, placeId, setFormData]);

  if (!loadedPlace && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find Place</h2>
        </Card>
      </div>
    );
  }

  //Updation Submission handler function:
  const placeUpdateSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      await sendRequest(
        `http://localhost:5000/api/places/${placeId}`,
        "PATCH",
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        },
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
        })
      );

      history.push("/" + auth.userId + "/places");
    } catch (err) {}
  };

  //returning UI:
  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedPlace && (
        <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
          <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid Title"
            onInput={inputHandler}
            initialValue={loadedPlace.title}
            initialValid={true}
          />
          <Input
            id="description"
            element="textarea"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid Description (at least five characters)"
            onInput={inputHandler}
            initialValue={loadedPlace.description}
            initialValid={true}
          />
          <Button type="submit" disabled={!formState.isValid}>
            UPDATE PLACE
          </Button>
        </form>
      )}
    </>
  );
}
