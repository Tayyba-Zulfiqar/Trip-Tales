import express from "express";
import placesRoutes from "./Routes/Places-routes.js";
import HttpError from "./models/http-error.js";
import userRoutes from "./Routes/Users-routes.js";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";

const app = express();
const PORT = 5000;

app.use(express.json());

//serve static files:
app.use("/Uploads/Images", express.static(path.join("Uploads", "Images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, address"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, PATCH");
  next();
});

app.use("/api/places", placesRoutes);
app.use("/api/users", userRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route", 404);
  throw error;
});

//general error handler:
app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (error) => {
      console.log(error);
    }); //delete file
  }
  if (res.headersSent) return next(error);
  res
    .status(error.code || 500)
    .json({ message: error.message || "Unknown error occurred" });
});

mongoose
  .connect(
    "mongodb+srv://tayybazulfiqar786:FLJOjfdjuwiwinoA@cluster0.klvisno.mongodb.net/mern?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("Connected to MongoDB.");
    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB connection failed:", error);
  });
