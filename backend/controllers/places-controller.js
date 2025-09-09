const HttpError = require("../models/http-error");
/* const uuid = require("uuid"); */
const { validationResult } = require("express-validator");

const Place = require("../models/place");
const User = require("../models/user");
const mongoose = require("mongoose");

const fs = require("fs");
const getCoordsForAddress = require("../util/location").getCoordsForAddress;

const getAllPlaces = async (req, res, next) => {
	let places;
	try {
		places = await Place.find();
		if (!places) {
			return next(new HttpError("Places not found", 404));
		}
	} catch (err) {
		return next(new HttpError("Fetching places failed, please try again later.", 500));
	}

	res.json({ places: places.map(place => place.toObject({ getters: true })) });
};

const getPlaceById = async (req, res, next) => {
	const placeId = req.params.placeId;

	let place;
	try {
		place = await Place.findById(placeId);
		if (!place) {
			return next(new HttpError("Place not found", 404));
		}
	} catch (err) {
		return next(new HttpError("Fetching place failed, please try again later.", 500));
	}

	res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesByUserId = async (req, res, next) => {
	const userId = req.params.uid;
	let userPlaces;
	try {
		userPlaces = await Place.find({ creator: userId });
	} catch (err) {
		return next(new HttpError("Fetching places failed, please try again later.", 500));
	}

	/* if (userPlaces.length === 0) {
		return next(new HttpError("No places found for this user", 404));
	} */

	res.json({ places: userPlaces.map(place => place.toObject({ getters: true })) });
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

	const createdPlace = new Place({
		title,
		description,
		imageUrl: req.file.path,
		address,
		location: coordinates,
		creator,
	});

	let user;

	try {
		user = await User.findById(creator);
		if (!user) {
			return next(new HttpError("Could not find user for provided id.", 404));
		}
	} catch (err) {
		return next(new HttpError("Creating place failed, please try again later.", 500));
	}

	try {
		const session = await mongoose.startSession();
		session.startTransaction();
		await createdPlace.save({ session });
		user.places.push(createdPlace);
		await user.save({ session });
		await session.commitTransaction();
	} catch (err) {
		return next(new HttpError(err.message, 500));
	}
	res.status(201).json({ place: createdPlace.toObject({ getters: true }) });
};

const updatePlace = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return next(new HttpError("Invalid inputs passed, please check your data.", 422));
	}

	const { title, description } = req.body;
	const placeId = req.params.placeId;
	let updatedPlace;
	try {
		updatedPlace = await Place.findById(placeId);
		if (!updatedPlace) {
			return next(new HttpError("Place not found", 404));
		}

		if (updatedPlace.creator.toString() !== req.userData.userId) {
			return next(new HttpError("You are not allowed to edit this place.", 401));
		}

		updatedPlace.title = title;
		updatedPlace.description = description;
		updatedPlace.save();
	} catch (err) {
		return next(new HttpError("Updating place failed, please try again later.", 500));
	}
	updatedPlace = updatedPlace.toObject({ getters: true });
	res.status(200).json({ place: updatedPlace });
};

const deletePlace = async (req, res, next) => {
	const placeId = req.params.placeId;
	let place;

	try {
		place = await Place.findById(placeId).populate("creator");
		if (!place) {
			return next(new HttpError("Place not found", 404));
		}
	} catch (err) {
		return next(new HttpError("Deleting place failed, please try again later.", 500));
	}

	if (place.creator.id !== req.userData.userId) {
		return next(new HttpError("You are not allowed to delete this place.", 401));
	}

	const imagePath = place.image;

	try {
		const session = await mongoose.startSession();
		session.startTransaction();

		await Place.findByIdAndDelete(placeId, { session });
		place.creator.places.pull(place);
		await place.creator.save({ session });

		await session.commitTransaction();
	} catch (err) {
		console.error("Delete error:", err);
		return next(new HttpError("Deleting place failed, please try again later.", 500));
	}

	fs.unlink(imagePath, err => {});
	res.status(200).json({ message: "Place deleted" });
};

exports.getAllPlaces = getAllPlaces;
exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
