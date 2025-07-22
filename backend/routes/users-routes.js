const express = require("express");
const { check } = require("express-validator");

const usersController = require("../controllers/users-controller");

const router = express.Router();

router.get("/", (req, res, next) => usersController.getUsers(req, res, next));

router.post(
	"/signup",
	[
		check("username").not().isEmpty(),
		check("email").normalizeEmail().isEmail(),
		check("password").isLength({ min: 6 }),
	],
	(req, res, next) => usersController.signup(req, res, next)
);

router.post("/login", (req, res, next) => usersController.login(req, res, next));

module.exports = router;
