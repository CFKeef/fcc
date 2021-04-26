const mongoose = require("mongoose");

const entrySchema = mongoose.Schema({
	description: { type: String, required: true },
	duration: { type: Number, required: true },
	date: { type: Date, default: Date.now },
});

const Entry = new mongoose.model("Entry", entrySchema);

module.exports = {Entry,entrySchema}