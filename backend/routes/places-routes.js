const express = require("express");

const HttpError = require("../models/http-error");

const router = express.Router();

const DUMMY_PLACES = [
	{
		id: "p1",
		title: "Empire State Building",
		description: "One of the most famous skyscrapers in the world.",
		imageUrl:
			"https://upload.wikimedia.org/wikipedia/commons/c/c7/Empire_State_Building_from_the_Top_of_the_Rock.jpg",
		address: "20 W 34th St, New York, NY 10001, USA",
		creator: "u1",
		location: {
			coordinates: {
				lat: 40.748817,
				lng: -73.985428,
			},
		},
	},
	{
		id: "p2",
		title: "Statue of Liberty",
		description: "A colossal neoclassical sculpture on Liberty Island.",
		imageUrl:
			"https://upload.wikimedia.org/wikipedia/commons/3/3d/Front_view_of_Statue_of_Liberty_with_pedestal_and_base_2024.jpg",
		address: "Liberty Island, New York, NY 10004, USA",
		creator: "u2",
		location: {
			coordinates: {
				lat: 40.689247,
				lng: -74.044502,
			},
		},
	},
];

router.get("/:placeId", (req, res, next) => {
	const placeId = req.params.placeId;
	const place = DUMMY_PLACES.find(p => p.id === placeId);

	if (!place) {
		throw new HttpError("Place not found");
	}

	res.json({ place });
});

router.get("/user/:uid", (req, res, next) => {
	const userId = req.params.uid;
	const userPlaces = DUMMY_PLACES.filter(p => p.creator === userId);

	if (userPlaces.length === 0) {
		return new HttpError("Place not found for the provided user ID", 404);
	}

	res.json({ places: userPlaces });
});

module.exports = router;
