import UsersList from "../Components/UsersList";
import { useEffect, useState } from "react";
import ErrorModal from "../../Shared/Components/UI-Elements/ErrorModal";
import LoadingSpinner from "../../Shared/Components/UI-Elements/LoadingSpinner";

export default function Users() {
  //managing states:
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [loadedUsers, setLoadedUsers] = useState();

  //fetching users :
  useEffect(() => {
    const sendRequest = async () => {
      setIsLoading(true);

      try {
        const response = await fetch("http://localhost:5000/api/users");
        const responseData = await response.json();
        setLoadedUsers(responseData.users);
        setIsLoading(false);

        if (!response.ok) {
          throw new Error(responseData.message);
        }
      } catch (error) {
        setError(error.message);
      }
      setIsLoading(false);
    };
    sendRequest();
  }, []);

  const errorHandler = () => {
    setError(null);
  };
  return (
    <>
      <ErrorModal error={error} onClear={errorHandler} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedUsers && <UsersList items={loadedUsers} />};
    </>
  );
}
