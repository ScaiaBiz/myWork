const Activity = require('../O_models/m_activity');

exports.postNewActivity = (req, res, next) => {
	const activity = new Activity({
		client: req.body.clientId,
		dueDate: req.body.dueDate,
		work: req.body.work,
		duration: req.body.duration,
		description: req.body.description,
		done: req.body.done,
		active: req.body.active,
	});

	return activity
		.save()
		.then(d => console.log(d))
		.catch(err => {
			console.log(err);
			return err;
		});
};

exports.getActivity = (req, res, next) => {
	const startDate = req.body.startDate;
	const endDate = req.body.endDate;
	//endDate deve essere domenica + 1gg

	Activity.find({ dueDate: { $gte: startDate, $lte: endDate } })
		.then(activityList => {
			console.log(activityList);
			// return res.status(201).json({
			//     activityList
			// });
			return res.status(201).json({ status: 'done' });
		})
		.catch(err => {
			console.log(err);
		});
};
