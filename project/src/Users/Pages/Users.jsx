import UsersList from "../Components/UsersList";
import { useEffect, useState } from "react";
import ErrorModal from "../../Shared/Components/UI-Elements/ErrorModal";
import LoadingSpinner from "../../Shared/Components/UI-Elements/LoadingSpinner";
import useHttpClient from "../../Shared/Hooks/http-hook.js";

export default function Users() {
  //managing states:
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedUsers, setLoadedUsers] = useState();

  //fetching users :
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(
          "http://localhost:5000/api/users"
        );
        setLoadedUsers(responseData.users);
      } catch (error) {}
    };
    fetchUsers();
  }, [sendRequest]);

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedUsers && <UsersList items={loadedUsers} />};
    </>
  );
}
