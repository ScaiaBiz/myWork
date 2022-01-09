const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const projectSchema = new Schema({
	customerId: {
		type: Schema.Types.ObjectId,
		ref: 'Contact',
		require: true,
	},
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	workType: {
		type: String,
		required: true,
	},
	status: {
		type: String,
		// required: true
	},
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
module.exports = mongoose.model('Project', projectSchema);
