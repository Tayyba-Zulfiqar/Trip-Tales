import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const Schema = mongoose.Schema;

//created schema:

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  image: { type: String, required: true },
  places: [{ type: mongoose.Types.ObjectId, required: true, ref: "Place" }], //array shows that one user can have multiple places
});

userSchema.plugin(uniqueValidator); //tells to create a unique new user if email doesnt already exists

const User = mongoose.model("User", userSchema);
export default User;
