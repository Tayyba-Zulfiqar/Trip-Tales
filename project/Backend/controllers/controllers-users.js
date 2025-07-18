import HttpError from "../models/http-error.js";
import { validationResult } from "express-validator";
import User from "../models/users.js";

//get user middleware:

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password"); // fetch all result from user excluding password field
  } catch (error) {
    return next(new HttpError("fetching user failed", 500));
  }

  res.json({ users: users.map((u) => u.toObject({ getters: true })) }); //find returns array
  //which cant be converted to js object
};

//sign up middleware:
const signUp = async (req, res, next) => {
  // express validaiton:
  const error = validationResult(req); // return errors if any.
  if (!error.isEmpty()) {
    console.log("error", error);

    //throw error:
    throw new HttpError("invalid inputs passed,  please check your data", 422);
  }

  //normal sign up logic :
  const { name, email, password } = req.body;

  //check if user already exist
  let exisitingUser;
  try {
    exisitingUser = await User.findOne({ email: email });
  } catch (err) {
    return next(new HttpError("Signing Up failed. Please try again.", 500));
  }

  //if user exists:
  if (exisitingUser) {
    return next(new HttpError("User already exists", 422));
  }

  //if user doesnt exist: (SIGN UP)
  const createdUser = new User({
    name,
    email,
    image: "../../Public/Imgs/image.png",
    password,
    places: [],
  });

  try {
    await createdUser.save();
  } catch (error) {
    return next(new HttpError("User sign up failed", 500));
  }
  res.status(201).json({ users: createdUser.toObject({ getters: true }) });
};

//log in middleware:
const logIn = async (req, res, next) => {
  const { email, password } = req.body;
  let identifiedUser;
  try {
    identifiedUser = await User.findOne({ email: email });
  } catch (error) {
    return next(new HttpError("Logging In failed", 500));
  }

  if (!identifiedUser || identifiedUser.password !== password) {
    return next(new HttpError("Invalid credentials", 401));
  }

  res.json({ message: "logged in" });
};

export { getUsers, signUp, logIn };
