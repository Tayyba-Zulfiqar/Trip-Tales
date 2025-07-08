import "./NewPlaces.css";
import Input from "../../Shared/Components/FormElements/Input";
import { VALIDATOR_REQUIRE } from "../../Shared/Util/Validators";
export default function NewPlaces() {
  return (
    <form className="place-form">
      <Input
        element="input"
        type="text"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="please enter a valid title"
      />
    </form>
  );
}
