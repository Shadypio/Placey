const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");

const DUMMY_USERS = [
	{
		id: "u1",
		username: "john_doe",
		email: "test@test.com",
		password: "password123",
	},
	{
		id: "u2",
		username: "jane_doe",
		email: "test2@test.com",
		password: "password456",
	},
];

const getUsers = (req, res, next) => {
	res.json({ users: DUMMY_USERS });
};

const signup = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		console.log(errors);
		return next(new HttpError("Invalid inputs passed, please check your data again.", 422));
	}

	const { username, email, password } = req.body;
	const hasUser = DUMMY_USERS.find(u => u.email === email);

	if (hasUser) {
		return next(new HttpError("User already exists, please login instead.", 422));
	}

	const newUser = {
		id: Math.random().toString(),
		username,
		email,
		password,
	};
	DUMMY_USERS.push(newUser);
	res.status(201).json({ user: newUser });
};

const login = (req, res, next) => {
	const { email, password } = req.body;

	const user = DUMMY_USERS.find(u => u.email === email && u.password === password);
	if (!user || user.password !== password) {
		return next(new HttpError("Invalid credentials", 401));
	}
	res.json({ message: "Logged in successfully", user });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
