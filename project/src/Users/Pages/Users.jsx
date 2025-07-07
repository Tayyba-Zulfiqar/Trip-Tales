import UsersList from "../Components/UsersList";

export default function Users() {
  const USERS = [
    {
      id: "u1",
      name: "tayyba",
      image: "../../../Public/Imgs/image.png",
      places: 3,
    },
  ];
  return <UsersList items={USERS} />;
}
