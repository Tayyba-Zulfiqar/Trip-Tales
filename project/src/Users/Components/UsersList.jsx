import "./UsersList.css";
import UsersItems from "./UserItems";
import Card from "../../Shared/Components/UI-Elements/Card";
export default function UsersList(props) {
  if (props.items.length === 0) {
    return (
      <div class="center">
        <Card>
          <h2>No user found</h2>
        </Card>
      </div>
    );
  }

  return (
    <ul className="users-list">
      {props.items.map((user) => (
        <UsersItems
          key={user.id}
          id={user.id}
          image={user.image}
          name={user.name}
          placeCount={user.places}
        />
      ))}
    </ul>
  );
}
