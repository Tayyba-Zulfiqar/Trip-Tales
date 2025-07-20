import { useParams } from "react-router-dom";
import PlaceList from "../Components/PlaceList";
import useHttpClient from "../../Shared/Hooks/http-hook.js";
import { useState, useEffect } from "react";
import ErrorModal from "../../Shared/Components/UI-Elements/ErrorModal";
import LoadingSpinner from "../../Shared/Components/UI-Elements/LoadingSpinner";

export default function UserPlaces() {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedPlace, setLoadedPlace] = useState([]);
  const userId = useParams().userId;

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await sendRequest(
          `http://localhost:5000/api/places/user/${userId}`
        );

        setLoadedPlace(response.places || response);
      } catch (err) {}
    };
    fetchPlaces();
  }, [sendRequest, userId]);

  const placeDeleteHandler = (deletedPlaceId) => {
    setLoadedPlace((prevPlaces) =>
      prevPlaces.filter((p) => p.id !== deletedPlaceId)
    );
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedPlace ? (
        <PlaceList items={loadedPlace} onDeletePlace={placeDeleteHandler} />
      ) : (
        !isLoading && <p>No places found.</p>
      )}
    </>
  );
}
