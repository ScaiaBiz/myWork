const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const workLogSchema = new Schema({
	contactId: { type: Schema.Types.ObjectId, ref: 'Contact', require: true },
	activityId: { type: Schema.Types.ObjectId, ref: 'Activity' },
	projectId: { type: Schema.Types.ObjectId, ref: 'Projects' },
	type: { type: String, default: 'workLog' },
	workType: { type: String, required: true },
	workDescription: { type: String, required: true },
	creationDate: { type: Date, required: true },
	dueDate: { type: Date, required: true },
	status: { type: String, required: true },
	title: { type: String, required: true },
	startWork: { type: Date },
	endWork: { type: Date },
	startBreak: { type: Date },
	breaksTime: { type: Number, default: 0 },
	minWorked: { type: Number, default: 0 },
	minToInvoice: { type: Number, default: 0 },
	workSummary: { type: String },
});

/*
---------------
//fixme: Non funziona, non è chiaro perchè, forse impostato male funzione?
workLogSchema.methods.evalWorkedTime = end => {
	let minWorked = (end - this.start - this.breaksTime) / 60000;
	console.log(minWorked);
	return minWorked.toFixed();
};
*/
module.exports = mongoose.model('WorkLog', workLogSchema);
