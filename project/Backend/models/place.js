import mongoose from "mongoose";

const Schema = mongoose.Schema;

//created schema:
const placeSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  address: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  creator: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
});

//model creation and exportation:
const Place = mongoose.model("Place", placeSchema); // Place => places (by default conversion)
export default Place;
