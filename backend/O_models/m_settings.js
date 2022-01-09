const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const textSchema = new Schema({
	name: { type: String, required: true, unique: true },
	value: [],
});

module.exports = mongoose.model('Text', textSchema);
