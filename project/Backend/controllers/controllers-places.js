import HttpError from "../models/http-error.js";
import { v4 as uuid } from "uuid";
import { validationResult } from "express-validator";
import getCoordsForAddress from "../utils/location.js";

//setting up dummy data"
let DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "One of the most famous skyscrapers in the world",
    imageUrl: "../../../Public/Imgs/place.jpg",
    address: "20 W 34th St., New York, NY 10001",
    location: {
      lat: 40.7484405,
      lng: -73.9878584,
    },
    creator: "u1",
  },
  {
    id: "p2",
    title: "Eiffel Tower",
    description: "The most iconic landmark in Paris",
    imageUrl: "../../../Public/Imgs/place.jpg",
    address: "Champ de Mars, 5 Avenue Anatole France, 75007 Paris, France",
    location: {
      lat: 48.8584,
      lng: 2.2945,
    },
    creator: "u2",
  },
];

//get place by user id:
const getPlacesByUserId = (req, res, next) => {
  const userId = req.params.uid;
  const places = DUMMY_PLACES.filter((p) => {
    return p.creator === userId;
  });
  if (!places || places.length === 0) {
    return next(
      new HttpError("Could not find the data for provided user id.", 404)
    );
  }

  res.json({ places });
};

//get place by place id:
const getPlaceById = (req, res, next) => {
  //getting id from url param:
  const placeId = req.params.pid;
  //finding relevant place:
  const place = DUMMY_PLACES.find((p) => {
    return p.id === placeId;
  });
  if (!place) {
    throw new HttpError("Could not find the data for provided place id.", 404);
  }
  res.json({ place });
};

//creating a new place:

const createPlace = (req, res, next) => {
  const error = validationResult(req); // return errors if any.
  if (!error.isEmpty()) {
    console.log("error", error);

    //throw error:
    throw new HttpError("invalid inputs passed,  please check your data", 422);
  }
  const { title, description, address, creator } = req.body;
  //translating coordiantes:
  const coordinates = getCoordsForAddress(address);
  const createdPlace = {
    id: uuid(),
    title,
    description,
    location: coordinates,
    address,
    creator,
  };
  DUMMY_PLACES.push(createdPlace);

  res.status(201).json({ place: createdPlace }); //successful creation code
};

//updating existing place:
const updatePlace = (req, res, next) => {
  const error = validationResult(req); // return errors if any.
  if (!error.isEmpty()) {
    console.log("error", error);

    //throw error:
    throw new HttpError("invalid inputs passed,  please check your data", 422);
  }

  //normal updation logic:
  const { title, description } = req.body;
  const placeId = req.params.pid;
  const updatedPlace = { ...DUMMY_PLACES.find((p) => p.id === placeId) };
  const placeIndex = DUMMY_PLACES.findIndex((p) => p.id === placeId);
  updatedPlace.title = title;
  updatedPlace.description = description;
  DUMMY_PLACES[placeIndex] = updatedPlace;

  res.status(200).json({ place: updatedPlace });
};

//delete existing place:
const deletePlace = (req, res, next) => {
  const placeId = req.params.pid;
  //if pkace doesnt already exists:
  if (!DUMMY_PLACES.find((p) => p.id === placeId)) {
    throw new HttpError("could not find place  for this id", 404);
  }

  //if place already exists:
  DUMMY_PLACES = DUMMY_PLACES.filter((p) => p.id !== placeId);
  res.status(200).json({ message: "place deleted" });
};

export {
  getPlaceById,
  getPlacesByUserId,
  createPlace,
  updatePlace,
  deletePlace,
};
