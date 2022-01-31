const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const projectSchema = new Schema({
	contactId: { type: Schema.Types.ObjectId, ref: 'Contact', require: true },
	referent: { type: String },
	title: { type: String, required: true },
	description: { type: String, required: true },
	workType: { type: String, required: true },
	status: { type: String, required: true },
	active: { type: Boolean, default: true },
	creationDate: { type: Date, required: true },
	startDate: { type: Date },
	dueDate: { type: Date },
	endDate: { type: Date },
	totalTimeWorked: { type: Number, default: 0 },
	totalTimeInvoiced: { type: Number, default: 0 },
	totalTimeToInvoice: { type: Number, default: 0 },
});

module.exports = mongoose.model('Project', projectSchema);
