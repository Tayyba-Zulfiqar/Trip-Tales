import "./PlaceItem.css";
import { useState, useContext } from "react";
import Card from "../../Shared/Components/UI-Elements/Card";
import Button from "../../Shared/Components/FormElements/Button";
import Modal from "../../Shared/Components/UI-Elements/Modal";
import AuthContext from "../../Shared/Context/Auth-context.js";

export default function PlaceItem(props) {
  //using context hook:
  const auth = useContext(AuthContext);
  //Managing states of map:
  const [showMap, setShowMap] = useState(false);

  //Confirmation box state management:
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  //Map state managing functions:
  const openMapHandler = () => setShowMap(true);
  const closeMapHandler = () => setShowMap(false);
  //Confirm box state managing functions:
  const showDeleteWarningHandler = () => setShowConfirmModal(true);
  const cancelDeleteHandler = () => setShowConfirmModal(false);
  const confirmDeleteHandler = () => {
    setShowConfirmModal(false);
    console.log("delete");
  };

  //returning ui of component:

  return (
    <>
      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={props.address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-action"
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
      >
        <div
          className="map-container"
          style={{
            width: "100%",
            height: "300px",
            maxHeight: "60vh",
            overflow: "hidden",
            borderRadius: "8px",
            marginTop: "10px",
          }}
        >
          <iframe
            title="Google Map"
            src={`https://www.google.com/maps?q=${props.coordinates.lat},${props.coordinates.lng}&output=embed`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </Modal>
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Are you sure?"
        footerClass="place-item__modal-actions"
        footer={
          <>
            <Button inverse onClick={cancelDeleteHandler}>
              CANCEL
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              DELETE
            </Button>
          </>
        }
      >
        <p>
          Do you want to proceed and delete this place? Please note that it
          can't be undone thereafter.
        </p>
      </Modal>

      <li className="place-item">
        <Card className="place-item__content">
          <div className="place-item__image">
            <img src={props.image} alt={props.title} />
          </div>
          <div className="place-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
          </div>
          <div className="place-item__actions">
            <Button inverse onClick={openMapHandler}>
              View on map
            </Button>
            {auth.isLoggedIn && (
              <Button to={`/places/${props.id}`}>Edit</Button>
            )}
            {auth.isLoggedIn && (
              <Button danger onClick={showDeleteWarningHandler}>
                Delete
              </Button>
            )}
          </div>
        </Card>
      </li>
    </>
  );
}
