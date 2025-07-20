import PlaceItem from "./PlaceItem";
import "./PlaceList.css";
import Card from "../../Shared/Components/UI-Elements/Card";
import Button from "../../Shared/Components/FormElements/Button";

export default function PlaceList(props) {
  if (props.items.length === 0) {
    return (
      <div className="place-list center">
        <Card>
          <h2>No place found. May be Create one?</h2>
          <Button to="/places/new">SHARE PLACE</Button>
        </Card>
      </div>
    );
  }

  return (
    <ul className="place-list">
      {props.items.map((place) => (
        <PlaceItem
          key={place.id}
          id={place.id}
          image={place.image}
          title={place.title}
          description={place.description}
          address={place.address}
          coordinates={place.location}
          onDelete={props.onDeletePlace}
        />
      ))}
    </ul>
  );
}
