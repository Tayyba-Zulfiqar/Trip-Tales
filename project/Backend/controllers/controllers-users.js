import HttpError from "../models/http-error.js";
import { validationResult } from "express-validator";
import User from "../models/users.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (e) {
    return next(new HttpError("Could not create user.", 500));
  }

  const createdUser = new User({
    name,
    email,
    password: hashedPassword,
    image: req.file.path, // path of image on server
    places: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    return next(new HttpError("Signing up failed, please try again.", 500));
  }

  // Generate JWT token
  let token;
  try {
    token = jwt.sign(
      {
        userId: createdUser.id,
        email: createdUser.email,
      },
      "supersecret_dont_share",
      {
        expiresIn: "1h",
      }
    );
  } catch (err) {
    return next(new HttpError("Signing up failed, please try again.", 500));
  }

  res
    .status(201)
    .json({ userId: createdUser.id, email: createdUser.email, token: token });
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

  if (!identifiedUser) {
    return next(
      new HttpError("Invalid credentials, could not log you in.", 403)
    );
  }

  let isValidPassword = false;
  try {
    // Compare plain password with hashed password in DB
    isValidPassword = await bcrypt.compare(password, identifiedUser.password);
  } catch (err) {
    return next(
      new HttpError("Invalid credentials, could not log you in.", 500)
    );
  }

  if (!isValidPassword) {
    return next(
      new HttpError("Invalid credentials, could not log you in.", 403)
    );
  }

  // Generate JWT token
  let token;
  try {
    token = jwt.sign(
      {
        userId: identifiedUser.id,
        email: identifiedUser.email,
      },
      "supersecret_dont_share",
      {
        expiresIn: "1h",
      }
    );
  } catch (err) {
    return next(new HttpError("Logging in failed, please try again.", 500));
  }

  res.status(200).json({
    userId: identifiedUser.id,
    email: identifiedUser.email,
    token: token,
  });
};

export { getUsers, signUp, logIn };
