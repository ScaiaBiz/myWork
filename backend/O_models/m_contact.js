const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const contactSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	initials: {
		type: String,
		required: true,
	},
	bg_color: {
		type: String,
		required: true,
	},
	address: {
		street: String,
		number: String,
		city: String,
		postCode: String,
		nation: String,
	},
	sub_contacts: [
		{
			name: { type: String, required: true },
			job: { type: String },
			mail: [{ description: String, addres: String }],
			phone: [{ description: String, number: Number }],
		},
	],
	projects: [
		{
			name: { type: String, required: true },
			dueDate: { type: Date },
			startDate: { type: Date, required: true },
			extimatedWorkTime: { type: Number },
			workedTime: { type: Number },
			open: { type: Boolean },
		},
	],
	works: [],
});

module.exports = mongoose.model('Contact', contactSchema);
