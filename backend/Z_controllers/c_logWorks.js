const Log = require('./../O_models/m_logWork');
const ObjectId = require('mongoose').Types.ObjectId;

exports.postStartLog = (req, res, next) => {
	if (!req.body.activityId) {
		//TODO: Crerare attività?
	}

	if (!req.body.projectId) {
		//TODO: Creare progetto?
	}

	const log = new Log({
		start: req.body.startTime,
		customerId: req.body.customerId,
		activityId: req.body.activityId,
		projectId: req.body.projectId,
		description: req.body.description,
		work: req.body.work,
		status: 'ONGOING',
	});
	log
		.save()
		.then(l => res.status(201).json({ l }))
		.catch(err => {
			console.log(err);
			res.status(400).json({ err });
		});
};

exports.postPauseLog = (req, res, next) => {
	const logId = req.body.logId;
	Log.findOne({ _id: logId })
		.then(log => {
			switch (log.status) {
				case 'ONGOING':
					log.startBreak = new Date();
					log.status = 'PAUSED';
					break;
				case 'PAUSED':
					const delta = new Date() - log.startBreak;
					log.breaksTime += delta;
					log.status = 'ONGOING';
					break;
				default:
					break;
			}
			log.save().then(status => res.status(201).json({ status }));
		})
		.catch(err => {
			console.log(err);
		});
};

exports.postStopLog = (req, res, next) => {
	const logId = req.body.logId;
	Log.findOne({ _id: logId })
		.then(log => {
			log.end = new Date();
			let minWorked = (log.end - log.start - log.breaksTime) / 60000;
			log.minWorked = minWorked.toFixed();
			log.workSummary = req.body.summary;
			log.status = 'FINISHED';
			log.save().then(status => res.status(201).json({ status }));
		})
		.catch(err => {
			console.log(err);
		});
};

exports.getCustomerLogs = (req, res, next) => {
	const customerId = req.params.custId;
	console.log(req.params);
	Log.find({ customerId: customerId })
		.sort({ _id: -1 })
		.limit(10)
		.then(logs => {
			res.status(201).json({ logs });
		})
		.catch(err => {
			console.log(err);
		});
};

exports.getLogs = (req, res, next) => {
	const limit = req.body.limit || 10;
	let sort = -1;
	if (req.body.oldest) {
		sort = 1;
	}
	Log.find()
		.sort({ _id: sort })
		.limit(limit)
		.then(logs => {
			res.status(201).json({ logs });
		})
		.catch(err => {
			console.log(err);
		});
};
