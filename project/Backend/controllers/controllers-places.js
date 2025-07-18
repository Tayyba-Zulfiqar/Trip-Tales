import HttpError from "../models/http-error.js";
import { v4 as uuid } from "uuid";
import { validationResult } from "express-validator";
import getCoordsForAddress from "../utils/location.js";
import Place from "../models/place.js";
import User from "../models/users.js";
import mongoose from "mongoose";

// Dummy data (used only in delete logic)
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

// GET /api/places/user/:uid
const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  let places;

  try {
    places = await Place.find({ creator: userId });
  } catch (error) {
    return next(
      new HttpError("Fetching places failed, please try again.", 500)
    );
  }

  if (!places || places.length === 0) {
    return next(
      new HttpError("No places found for the provided user ID.", 404)
    );
  }

  res.json({ places: places.map((p) => p.toObject({ getters: true })) });
};

// GET /api/places/:pid
const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;

  try {
    place = await Place.findById(placeId);
  } catch (error) {
    return next(
      new HttpError("Could not retrieve place, please try again.", 500)
    );
  }

  if (!place) {
    return next(new HttpError("No place found for the provided ID.", 404));
  }

  res.json({ place: place.toObject({ getters: true }) });
};

// POST /api/places
const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { title, description, address, creator } = req.body;
  const coordinates = getCoordsForAddress(address);

  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image: "../../../Public/Imgs/place.jpg", // you can make this dynamic later
    creator,
  });

  let user;
  try {
    user = await User.findById(creator);
  } catch (err) {
    return next(new HttpError("Creating place failed, please try again.", 500));
  }

  if (!user) {
    return next(new HttpError("Could not find user for provided id", 404));
  }

  //creatings session and transactions
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    user.places.push(createdPlace);
    await user.save({ session: sess });
    sess.commitTransaction();
  } catch (error) {
    return next(new HttpError("Creating place failed, please try again.", 500));
  }

  res.status(201).json({ place: createdPlace });
};

// PATCH /api/places/:pid
const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { title, description } = req.body;
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (error) {
    return next(
      new HttpError("Could not retrieve place, please try again.", 500)
    );
  }

  if (!place) {
    return next(new HttpError("Place not found.", 404));
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (error) {
    return next(
      new HttpError("Could not update place, please try again.", 500)
    );
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

// DELETE /api/places/:pid
const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;

  try {
    const deletedPlace = await Place.findByIdAndDelete(placeId);

    if (!deletedPlace) {
      return next(new HttpError("Place not found.", 404));
    }

    res.status(200).json({ message: "Place deleted successfully." });
  } catch (error) {
    return next(
      new HttpError("Could not delete place, please try again.", 500)
    );
  }
};

export {
  getPlaceById,
  getPlacesByUserId,
  createPlace,
  updatePlace,
  deletePlace,
};
