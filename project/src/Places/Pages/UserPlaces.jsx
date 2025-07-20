import { useParams } from "react-router-dom";
import PlaceList from "../Components/PlaceList";
import useHttpClient from "../../Shared/Hooks/http-hook.js";
import { useState, useEffect } from "react";
import ErrorModal from "../../Shared/Components/UI-Elements/ErrorModal";
import LoadingSpinner from "../../Shared/Components/UI-Elements/LoadingSpinner";

export default function UserPlaces() {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedPlace, setLoadedPlace] = useState(null);
  const userId = useParams().userId;

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        console.log("Fetching places for userId:", userId);
        const response = await sendRequest(
          `http://localhost:5000/api/places/user/${userId}`
        );
        console.log("API response:", response);
        setLoadedPlace(response.places || response);
      } catch (err) {
        console.error("Error:", err);
      }
    };
    fetchPlaces();
  }, [sendRequest, userId]);

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedPlace ? (
        <PlaceList items={loadedPlace} />
      ) : (
        !isLoading && <p>No places found.</p>
      )}
    </>
  );
}
