import express from "express";

//getting router from express package:
const router = express.Router();

//setting up dummy data"
const DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "One of the most famous skyscrapers in the world",
    imageUrl: "../../../Public/Imgs/place.jpg",
    address: "20 W 34th St., New York, NY 10001",
    location: {
      lat: 40.7484405,
      lng: -73.9878584,
    },
    creator: "u1",
  },
  {
    id: "p2",
    title: "Eiffel Tower",
    description: "The most iconic landmark in Paris",
    imageUrl: "../../../Public/Imgs/place.jpg",
    address: "Champ de Mars, 5 Avenue Anatole France, 75007 Paris, France",
    location: {
      lat: 48.8584,
      lng: 2.2945,
    },
    creator: "u2",
  },
];

//Route set up to get place by place id:
router.get("/:pid", (req, res, next) => {
  //getting id from url param:
  const placeId = req.params.pid;
  //finding relevant place:
  const place = DUMMY_PLACES.find((p) => {
    return p.id === placeId;
  });
  res.json({ place });
});

//Route setup to get place by user id:
router.get("/user/:uid", (req, res, next) => {
  const userId = req.params.uid;
  const place = DUMMY_PLACES.find((p) => {
    return p.creator === userId;
  });

  res.json({ place });
});

export default router;
