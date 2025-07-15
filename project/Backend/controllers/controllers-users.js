import { v4 as uuid } from "uuid";
import HttpError from "../models/http-error.js";
import { validationResult } from "express-validator";

//dummy data:
const DUMMY_USERS = [
  {
    id: "u1",
    name: "tayyba",
    email: "test@test.com",
    password: "1233",
  },
];

//get user middleware:

const getUsers = (req, res, next) => {
  res.json({ users: DUMMY_USERS });
};

//sign up middleware:
const signUp = (req, res, next) => {
  // express validaiton:
  const error = validationResult(req); // return errors if any.
  if (!error.isEmpty()) {
    console.log("error", error);

    //throw error:
    throw new HttpError("invalid inputs passed,  please check your data", 422);
  }

  //normal sign up logic :
  const { name, email, password } = req.body;
  const hasUser = DUMMY_USERS.find((u) => u.email === email);

  //check if user already exist
  if (hasUser) {
    throw new HttpError("user already exists", 422);
  }

  //if user doesnt exist:
  const createdUser = {
    id: uuid(),
    name,
    email,
    password,
  };

  DUMMY_USERS.push(createdUser);
  res.status(201).json({ users: createdUser });
};

//log in middleware:
const logIn = (req, res, next) => {
  const { email, password } = req.body;
  const identifiedUser = DUMMY_USERS.find((u) => u.email === email);

  if (!identifiedUser) {
    console.log("User not found!");
    return next(new HttpError("Email not found", 401));
  }

  if (identifiedUser.password !== password) {
    console.log("Password mismatch!");
    return next(new HttpError("Incorrect password", 401));
  }

  res.json({ message: "logged in" });
};

export { getUsers, signUp, logIn };
