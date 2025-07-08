import PlaceItem from "./PlaceItem";
import "./PlaceList.css";

export default function PlaceList(props) {
  if (props.items.length === 0) {
    return <h2 className="place-list__fallback">No places found.</h2>;
  }

  return (
    <ul className="place-list">
      {props.items.map((place) => (
        <PlaceItem
          key={place.id}
          id={place.id}
          image={place.imageUrl}
          title={place.title}
          description={place.description}
          address={place.address}
          coordinates={place.location}
        />
      ))}
    </ul>
  );
}
