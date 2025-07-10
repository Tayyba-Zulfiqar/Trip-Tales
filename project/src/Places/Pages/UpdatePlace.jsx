import { useParams } from "react-router-dom";
import Input from "../../Shared/Components/FormElements/Input";
import Button from "../../Shared/Components/FormElements/Button";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../Shared/Util/Validators";
import "./PlaceForm.css";
import Card from "../../Shared/Components/UI-Elements/Card";

import { useEffect, useState } from "react";
import useForm from "../../Shared/Hooks/Form-hook";

const DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "One of the most famous skyscrapers in the world",
    imageUrl: "../../../Public/Imgs/place.jpg",
    address: "20 W 34th St., New York, NY 10001",
    location: {
      lat: 40.7484405,
      lng: -73.9878584,
    },
    creator: "u1",
  },
  {
    id: "p2",
    title: "Eiffel Tower",
    description: "The most iconic landmark in Paris",
    imageUrl: "../../../Public/Imgs/place.jpg",
    address: "Champ de Mars, 5 Avenue Anatole France, 75007 Paris, France",
    location: {
      lat: 48.8584,
      lng: 2.2945,
    },
    creator: "u2",
  },
];

export default function UpdatePlace(props) {
  //handling loading state:
  const [isLoading, setIsLoading] = useState(true);
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

  //finding matched if:
  const identifiedPlace = DUMMY_PLACES.find((place) => place.id === placeId);
  if (!identifiedPlace) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find Place</h2>
        </Card>
      </div>
    );
  }
  //initializing form:
  useEffect(() => {
    if (identifiedPlace) {
      setFormData({
        title: { value: identifiedPlace.title, isValid: true },
        description: { value: identifiedPlace.description, isValid: true },
      });
    }

    setIsLoading(false);
  }, [setFormData, identifiedPlace]);

  //if data has not been loaded yet:
  if (isLoading) {
    return (
      <div className="center">
        <h2>Loading...</h2>
      </div>
    );
  }

  //Updation Submission handler function:
  const placeUpdateSubmitHandler = (event) => {
    event.preventDefault();
    console.log(formState.inputs);
  };

  //returning UI:
  return (
    <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
      <Input
        id="title"
        element="input"
        type="text"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid Title"
        onInput={inputHandler}
        initialValue={formState.inputs.title.value}
        initialValid={formState.inputs.title.isValid}
      />
      <Input
        id="description"
        element="textarea"
        label="Description"
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText="Please enter a valid Description (at least five characters)"
        onInput={inputHandler}
        initialValue={formState.inputs.description.value}
        initialValid={formState.inputs.description.isValid}
      />
      <Button type="submit" disabled={!formState.isValid}>
        UPDATE PLACE
      </Button>
    </form>
  );
}
