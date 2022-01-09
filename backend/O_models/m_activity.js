const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const activitySchema = new Schema({
	client: { type: Schema.Types.ObjectId, ref: 'Contact', required: true },
	dueDate: { type: Date, require: true },
	work: { type: String, reqeuired: true },
	duration: { type: Number, required: true },
	description: { type: String, reqeuired: true },
	done: { type: Boolean },
	active: { type: Boolean },
});

// activitySchema.methods.updateActivity = function (activity) {};

module.exports = mongoose.model('Activity', activitySchema);
