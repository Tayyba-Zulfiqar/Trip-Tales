import express from "express";
import placesRoutes from "./Routes/Places-routes.js";
import HttpError from "./models/http-error.js";
import userRoutes from "./Routes/Users-routes.js";
import mongoose from "mongoose";
//create app using express:
const app = express();

//port set up:
const PORT = 5000;

//Middleware: tell server to expect json data as incoming req
app.use(express.json());

//using route as middleware:
app.use("/api/places", placesRoutes);
app.use("/api/users", userRoutes);

//middleware for requests that never be reached:
app.use((req, res, next) => {
  const error = new HttpError("could not find this route", 404);
  throw error;
});

//for routes that dont exist:
app.use((error, req, res, next) => {
  if (res.headerSet) {
    return next(error);
  }
  res
    .status(error.code || 500)
    .json({ message: error.message || "unknown error occured" });
});

mongoose
  .connect(
    "mongodb+srv://tayybazulfiqar786:<RUe46pHb0GugUaJt>@cluster0.klvisno.mongodb.net/places?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    //listen to incoming request:
    app.listen(PORT);
  })
  .catch((error) => {
    console.log(error);
  });
