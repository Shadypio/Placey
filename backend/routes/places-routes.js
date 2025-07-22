const express = require("express");

const placesController = require("../controllers/places-controller");

const router = express.Router();

router.get("/", (req, res, next) => placesController.getAllPlaces(req, res, next));

router.get("/:placeId", (req, res, next) => placesController.getPlaceById(req, res, next));

router.get("/user/:uid", (req, res, next) => placesController.getPlacesByUserId(req, res, next));

router.post("/", (req, res, next) => placesController.createPlace(req, res, next));

router.patch("/:placeId", (req, res, next) => placesController.updatePlace(req, res, next));

router.delete("/:placeId", (req, res, next) => placesController.deletePlace(req, res, next));

module.exports = router;
