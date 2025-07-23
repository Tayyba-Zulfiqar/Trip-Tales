import express from "express";
import CheckAuth from "../Middlewares/check-auth.js";
import {
  getPlaceById,
  getPlacesByUserId,
  createPlace,
  updatePlace,
  deletePlace,
} from "../controllers/controllers-places.js";
import { check } from "express-validator"; //check --> method that return validation middleware
import fileUpload from "../Middlewares/file-upload.js";

//getting router from express package:
const router = express.Router();

//ACCESSABLE WITHOUT TOKEN:
router.get("/:pid", getPlaceById);
router.get("/user/:uid", getPlacesByUserId);

//NOT ACCESSABLE WITHOUT VALID TOKEN:
router.use(CheckAuth);

router.post(
  "/",
  fileUpload.single("image"),
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").not().isEmpty(),
  ],
  createPlace
);

router.patch(
  "/:pid",
  [check("title").not().isEmpty(), check("description").isLength({ min: 5 })],
  updatePlace
);

router.delete("/:pid", deletePlace);

export default router;
