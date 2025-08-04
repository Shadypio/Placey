const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");

const User = require("../models/user");

const getUsers = async (req, res, next) => {
	let users;
	try {
		users = await User.find({}, "-password");
	} catch (err) {
		return next(new HttpError("Fetching users failed, please try again later.", 500));
	}
	if (!users) {
		return next(new HttpError("Users not found", 404));
	}
	res.json({ users: users.map(user => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return next(new HttpError("Invalid inputs passed, please check your data again.", 422));
	}

	const { name, email, password } = req.body;
	let existingUser;
	try {
		existingUser = await User.findOne({ email: email });
	} catch (err) {
		return next(new HttpError("Signing up failed, please try again later.", 500));
	}

	if (existingUser) {
		return next(new HttpError("User exists already, please login instead.", 422));
	}

	const createdUser = new User({
		name,
		email,
		password,
		image: "https://placehold.co/600x400", // Placeholder for user image
		places: [],
	});

	try {
		await createdUser.save();
	} catch (err) {
		return next(new HttpError("Signing up failed, please try again.", 500));
	}
	res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
	const { email, password } = req.body;
	let existingUser;
	try {
		existingUser = await User.findOne({ email: email });
	} catch (err) {
		return next(new HttpError("Logging in failed, please try again later.", 500));
	}

	if (!existingUser || existingUser.password !== password) {
		return next(new HttpError("Invalid credentials, could not log you in.", 401));
	}

	const user = existingUser.toObject({ getters: true });

	res.json({ message: "Logged in successfully", user });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
