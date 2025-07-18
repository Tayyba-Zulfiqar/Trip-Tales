import "./UserItems.css";
import { Link } from "react-router-dom";
import Avatar from "../../Shared/Components/UI-Elements/Avatar.jsx";

export default function UsersItems(props) {
  return (
    <li className="user-item">
      <div className="user-item__content">
        <Link to={`/${props.id}/places`}>
          <div className="user-item__image">
            <Avatar image={props.image} alt={props.name} />
          </div>
          <div className="user-item__info">
            <h2>{props.name}</h2>
            <h3>
              {props.placeCount} {props.placeCount === 1 ? "Place" : "Places"}
            </h3>
          </div>
        </Link>
      </div>
    </li>
  );
}
