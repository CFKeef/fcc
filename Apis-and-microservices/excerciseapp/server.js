const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { User, Entry } = require("./db/models/exports");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(express.static("public"));
app.get("/", (req, res) => {
	res.sendFile(__dirname + "/views/index.html");
});

/**
 * You can POST to /api/users with form data username to create a new user. The returned response will be an object with username and _id properties.
 */
app.post("/api/users", async (req, res) => {
	const newUser = await User.create(req.body);

	if (newUser) {
		res.json({ username: newUser.username, _id: newUser._id });
	} else {
		res.json({ error: "Error creating user" });
	}
});

/**
 * You can make a GET request to /api/users to get an array of all users. Each element in the array is an object containing a user's username and _id.
 * https://stackoverflow.com/questions/25330555/mongoose-find-return-specific-properties
 */
app.get("/api/users", async (req, res) => {
	const userList = await User.find({}, "username _id");

	if (userList) res.json(userList);
	else res.json({ error: "Error fetching users" });
});

/**
 * You can POST to /api/users/:_id/exercises with form data description, duration, and optionally date. If no date is supplied, the current date will be used. The response returned will be the user object with the exercise fields added.
 */
app.post("/api/users/:id/exercises", async (req, res) => {
	const { id } = req.params;
	const user = await User.findById(id);

	if (user) {
		const newEntry = await Entry.Entry.create(req.body);
		user.log.push(newEntry);
		await user.save();

		const returnObject = {
			_id: user._id,
			username: user.username,
			date: newEntry.date.toDateString(),
			duration: newEntry.duration,
			description: newEntry.description,
		};

		res.json(returnObject);
	} else res.json({ error: "Couldn't add excercise" });
});

app.get("/api/users/:id/logs", async (req, res) => {
	const { id } = req.params;
	const { from, to, limit } = req.query;
	let options;
	let user;

	if (limit) {
		user = await User.findById(id, options)
			.slice("log", Number(limit))
			.exec();
	} else user = await User.findById(id);

	if (user) {
		if (from)
			user.log = user.log.filter(
				(entry) => entry.date.getTime() > new Date(from).getTime()
			);

		if (to)
			user.log = user.log.filter(
				(entry) => entry.date.getTime() < new Date(to).getTime()
			);

		const response = {
			_id: user._id,
			username: user.username,
			count: user.log.length,
			log: user.log,
		};

		res.json(response);
	} else res.json({ error: "Couldn't find user" });
});

const listener = app.listen(process.env.PORT || 3000, () => {
	console.log("Your app is listening on port " + listener.address().port);
});
