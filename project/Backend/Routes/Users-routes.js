import express from "express";
import { getUsers, signUp, logIn } from "../controllers/controllers-users.js";
import { check } from "express-validator";

//getting router from express package:
const router = express.Router();

//routes setup:
router.get("/", getUsers);

router.post(
  "/signup",
  [
    check("name").not().isEmpty(),
    check("email")
      .normalizeEmail() // Test@test.com => test@test.com
      .isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  signUp
);

router.post("/login", logIn);

export default router;
