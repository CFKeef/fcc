const mongoose = require("mongoose");
const entrySchema = require("./Entry").entrySchema

const userSchema = mongoose.Schema({
	username: { type: String, required: true, unique: true },
	log: [entrySchema],
});

const User = new mongoose.model("User", userSchema);

module.exports = User;
