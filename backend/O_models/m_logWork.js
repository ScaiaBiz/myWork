const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const workLogSchema = new Schema({
	customerId: {
		type: Schema.Types.ObjectId,
		ref: 'Contact',
		require: true,
	},
	activityId: {
		type: Schema.Types.ObjectId,
		ref: 'Activity',
	},
	project: {
		id: {
			type: Schema.Types.ObjectId,
			ref: 'Projects',
			// required: true,
		},
		name: {
			type: String,
			// required: true,
		},
	},
	description: {
		type: String,
		required: true,
	},
	work: {
		type: String,
		required: true,
	},
	workSummary: {
		type: String,
	},
	start: {
		type: Date,
		required: true,
	},
	end: {
		type: Date,
	},
	startBreak: { type: Date },
	breaksTime: { type: Number, default: 0 },
	minWorked: { type: Number, default: 0 },
	minToInvoice: { type: Number, default: 0 },
	status: { type: String, required: true },
});

//todo: Creare funzione per valutare minuti lavorati

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
