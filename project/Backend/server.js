import express from "express";
import placesRoutes from "./Routes/Places-routes.js";
import HttpError from "./models/http-error.js";
import userRoutes from "./Routes/Users-routes.js";
import mongoose from "mongoose";

const app = express();
const PORT = 5000;

app.use(express.json());

//attaching headers to all response for back-end and front-end connections:
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); //tell to which domain we can have access
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, content-type, Accept,Authorization "
  ); //tell with which headers requests we should allow
  res.setHeader("Access-Control-Allow-Methods", "GET , POST, DELETE, PATCH, "); //which mehtods can be sent from frontend
  next();
});

app.use("/api/places", placesRoutes);
app.use("/api/users", userRoutes);

// Handle undefined routes
app.use((req, res, next) => {
  const error = new HttpError("Could not find this route", 404);
  throw error;
});

// Global error handler
app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }
  res
    .status(error.code || 500)
    .json({ message: error.message || "Unknown error occurred" });
});

mongoose
  .connect(
    "mongodb+srv://tayybazulfiqar786:FLJOjfdjuwiwinoA@cluster0.klvisno.mongodb.net/mern?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    app.listen(PORT, () => {
      console.log(` Server is running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB connection failed:", error);
  });
