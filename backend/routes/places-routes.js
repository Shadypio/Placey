const express = require("express");
const { check } = require("express-validator");

const placesController = require("../controllers/places-controller");

const router = express.Router();

const fileUpload = require("../middleware/file-upload");

const checkAuth = require("../middleware/check-auth");

router.get("/", (req, res, next) => placesController.getAllPlaces(req, res, next));

router.get("/user/:uid", (req, res, next) => placesController.getPlacesByUserId(req, res, next));

router.get("/:placeId", (req, res, next) => placesController.getPlaceById(req, res, next));

router.use(checkAuth);

router.post(
	"/",
	fileUpload.single("image"),
	[
		check("title").not().isEmpty(),
		check("description").isLength({ min: 5 }),
		check("address").not().isEmpty(),
		check("creator").not().isEmpty(),
	],
	(req, res, next) => placesController.createPlace(req, res, next)
);

router.patch(
	"/:placeId",
	[check("title").not().isEmpty(), check("description").isLength({ min: 5 })],
	(req, res, next) => placesController.updatePlace(req, res, next)
);

router.delete("/:placeId", (req, res, next) => placesController.deletePlace(req, res, next));

module.exports = router;
