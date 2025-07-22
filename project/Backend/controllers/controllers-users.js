import HttpError from "../models/http-error.js";
import { validationResult } from "express-validator";
import User from "../models/users.js";

// GET ALL USERS
const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password"); // Exclude password field
  } catch (error) {
    return next(new HttpError("Fetching users failed. Please try again.", 500));
  }

  res.json({ users: users.map((u) => u.toObject({ getters: true })) });
};

// SIGNUP
const signUp = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    return next(
      new HttpError("Signing up failed, please try again later.", 500)
    );
  }

  if (existingUser) {
    return next(
      new HttpError("User exists already, please login instead.", 422)
    );
  }

  const createdUser = new User({
    name,
    email,
    password, // ⚠️ Password should be hashed using bcrypt in production
    image: req.file.path, // path of img on server
    places: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    return next(new HttpError("Signing up failed, please try again.", 500));
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

// LOGIN
const logIn = async (req, res, next) => {
  const { email, password } = req.body;

  let identifiedUser;
  try {
    identifiedUser = await User.findOne({ email });
  } catch (err) {
    return next(
      new HttpError("Logging in failed, please try again later.", 500)
    );
  }

  if (!identifiedUser || identifiedUser.password !== password) {
    return next(
      new HttpError("Invalid credentials, could not log you in.", 401)
    );
  }

  res.json({
    message: "Logged in successfully!",
    user: identifiedUser.toObject({ getters: true }),
  });
};

export { getUsers, signUp, logIn };
