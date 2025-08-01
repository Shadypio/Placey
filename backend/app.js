const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error");

const app = express();

app.use(bodyParser.json());

app.use("/api/places", placesRoutes);

app.use("/api/users", usersRoutes);

app.use((req, res, next) => {
	const error = new HttpError("Could not find this route.", 404);
	next(error);
});

app.use((error, req, res, next) => {
	if (res.headerSent) {
		return next(error);
	}
	res.status(error.code || 500).json({ message: error.message || "An unknown error occurred!" });
});

mongoose
	.connect(process.env.MONGODB_URI)
	.then(() => {
		app.listen(process.env.PORT || 5000, () => {
			console.log(`Server is running on port ${process.env.PORT || 5000}`);
		});
	})
	.catch(err => {
		console.error("Database connection failed:", err);
	});
