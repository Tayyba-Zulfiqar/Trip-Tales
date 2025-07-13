import express from "express";
import {
  getPlaceById,
  getPlacesByUserId,
  createPlace,
  updatePlace,
  deletePlace,
} from "../controllers/controllers-places.js";

//getting router from express package:
const router = express.Router();

//Route set up to get place by place id:
router.get("/:pid", getPlaceById);

//Route setup to get place by user id:
router.get("/user/:uid", getPlacesByUserId);

router.post("/", createPlace);

router.patch("/:pid", updatePlace);

router.delete("/:pid", deletePlace);

export default router;
