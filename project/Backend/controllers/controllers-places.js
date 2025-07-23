import HttpError from "../models/http-error.js";
import { validationResult } from "express-validator";
import getCoordsForAddress from "../utils/location.js";
import Place from "../models/place.js";
import User from "../models/users.js";
import mongoose from "mongoose";
import fs from "fs";

// GET /api/places/user/:uid
const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  let userWithPlaces;

  try {
    userWithPlaces = await User.findById(userId).populate("places");
  } catch (error) {
    return next(
      new HttpError("Fetching places failed, please try again.", 500)
    );
  }

  if (!userWithPlaces || userWithPlaces.places.length === 0) {
    return next(
      new HttpError("No places found for the provided user ID.", 404)
    );
  }

  res.json({
    places: userWithPlaces.places.map((p) => p.toObject({ getters: true })),
  });
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
    image: req.file.path, // Correct image path from multer
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

  // Transaction for place creation and user update
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    user.places.push(createdPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();
    sess.endSession();
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

  let place;
  try {
    place = await Place.findById(placeId).populate("creator");
  } catch (error) {
    return next(
      new HttpError("Could not delete place, please try again.", 500)
    );
  }

  if (!place) {
    return next(new HttpError("Could not find place with that ID.", 404));
  }

  const imagePath = place.image;

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await Place.deleteOne({ _id: placeId }, { session: sess });
    place.creator.places.pull(place._id);
    await place.creator.save({ session: sess });
    await sess.commitTransaction();
    sess.endSession();
  } catch (error) {
    return next(
      new HttpError("Could not delete place, please try again.", 500)
    );
  }

  // Delete associated image from disk
  fs.unlink(imagePath, (err) => {
    if (err) console.error("Image deletion failed:", err);
  });

  res.status(200).json({ message: "Place deleted" });
};

export {
  getPlaceById,
  getPlacesByUserId,
  createPlace,
  updatePlace,
  deletePlace,
};
