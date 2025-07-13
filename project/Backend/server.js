import express from "express";
import placesRoutes from "./Routes/Places-routes.js";
import HttpError from "./models/http-error.js";

//create app using express:
const app = express();

//port set up:
const PORT = 5000;

//Middleware: tell server to expect json data as incoming req
app.use(express.json());

//using route as middleware:
app.use("/api/places", placesRoutes);

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
//listen to incoming request:
app.listen(PORT, () => {
  console.log(`server has started at PORT : ${PORT}`);
});
