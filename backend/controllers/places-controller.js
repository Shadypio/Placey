const HttpError = require("../models/http-error");
/* const uuid = require("uuid"); */
const { validationResult } = require("express-validator");

let DUMMY_PLACES = [
	{
		id: "p1",
		title: "Empire State Building",
		description: "One of the most famous skyscrapers in the world.",
		imageUrl:
			"https://upload.wikimedia.org/wikipedia/commons/c/c7/Empire_State_Building_from_the_Top_of_the_Rock.jpg",
		address: "20 W 34th St, New York, NY 10001, USA",
		creator: "u1",
		location: {
			lat: 40.748817,
			lng: -73.985428,
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
			lat: 40.689247,
			lng: -74.044502,
		},
	},
];

const getCoordsForAddress = require("../util/location").getCoordsForAddress;

const getAllPlaces = (req, res, next) => {
	res.json({ DUMMY_PLACES });
};

const getPlaceById = (req, res, next) => {
	const placeId = req.params.placeId;
	const place = DUMMY_PLACES.find(p => p.id === placeId);

	if (!place) {
		return next(new HttpError("Place not found", 404));
	}

	res.json({ place });
};

const getPlacesByUserId = (req, res, next) => {
	const userId = req.params.uid;
	const userPlaces = DUMMY_PLACES.filter(p => p.creator === userId);

	if (userPlaces.length === 0) {
		return next(new HttpError("No places found for this user", 404));
	}

	res.json({ places: userPlaces });
};

const createPlace = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		next(new HttpError("Invalid inputs passed, please check your data.", 422));
	}

	const { title, description, address, creator } = req.body;

	let coordinates;
	try {
		coordinates = await getCoordsForAddress(address);
	} catch (error) {
		return next(error);
	}

	const newPlace = {
		/* id: uuid.v4(), */
		id: Math.random().toString(),
		title,
		description,
		address,
		creator,
		location: coordinates,
	};
	DUMMY_PLACES.push(newPlace);
	res.status(201).json({ place: newPlace });
};

const updatePlace = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return next(new HttpError("Invalid inputs passed, please check your data.", 422));
	}

	const { title, description } = req.body;
	const placeId = req.params.placeId;
	const placeIndex = DUMMY_PLACES.findIndex(p => p.id === placeId);
	if (placeIndex === -1) {
		return next(new HttpError("Place not found", 404));
	}
	const updatedPlace = { ...DUMMY_PLACES[placeIndex], title, description };
	DUMMY_PLACES[placeIndex] = updatedPlace;
	res.status(200).json({ place: updatedPlace });
};

const deletePlace = (req, res, next) => {
	const placeId = req.params.placeId;
	DUMMY_PLACES = DUMMY_PLACES.filter(p => p.id !== placeId);
	res.status(200).json({ message: "Place deleted" });
};

exports.getAllPlaces = getAllPlaces;
exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
