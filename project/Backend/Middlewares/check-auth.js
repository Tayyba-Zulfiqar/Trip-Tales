import HttpError from "../models/http-error.js";
import jwt from "jsonwebtoken";

export default function CheckAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  // OPTIONS => by default req sent by browser, before our actual req, to check if server permits access
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    // extract token (part of header string at index 1)
    // AUTHORIZATION: BEARER Token
    const authHeader = req.headers.authorization;

    // if authorization header is missing or doesn't start with "Bearer"
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new Error("Authorization failed");
    }

    const token = authHeader.split(" ")[1];

    // if split successful but token is undefined
    if (!token) {
      throw new Error("Authorization failed");
    }

    const decodedtoken = jwt.verify(token, "supersecret_dont_share"); // returns a payload (id + email + token)

    req.userData = { userId: decodedtoken.userId }; // added userId validated with token

    next();
  } catch (e) {
    // if split or verify failed:
    return next(new HttpError("Authentication failed", 403));
  }
}
