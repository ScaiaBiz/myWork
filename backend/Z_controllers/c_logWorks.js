const Log = require('./../O_models/m_logWork');
const Project = require('./../O_models/m_projects');
const ObjectId = require('mongoose').Types.ObjectId;

const HttpError = require('../O_models/m_error');

exports.postNewLog = (req, res, next) => {
	//todo: Da sistemare!
	if (!req.body.activityId) {
	}

	if (!req.body.projectId) {
	}
	console.log('>>> Creato nuova attività');
	const log = new Log({
		contactId: req.body.contactId,
		projectId: req.body.projectId,
		workType: req.body.workType,
		workDescription: req.body.workDescription,
		creationDate: new Date(),
		dueDate: req.body.dueDate,
		status: req.body.status,
		title: req.body.title,
	});
	log
		.save()
		.then(l => res.status(201).json({ l }))
		.catch(err => {
			console.log(err);
			res.status(400).json({ err });
		});
};

exports.postStartLog = (req, res, next) => {
	console.log('Inizia attività');
};
exports.postPauseLog = (req, res, next) => {
	const logId = req.body.logId;
	const checkActiveLog = async () => {
		console.log('> Verifico presenza attività in corso');
		const activeLogs = await Log.findOne({ status: 'ONGOING' });
		if (activeLogs) {
			return [true, activeLogs];
		}
		return [false, activeLogs];
	};
	Log.findOne({ _id: logId })
		.then(async log => {
			const activeLog = await checkActiveLog();
			switch (log.status) {
				case 'TODO':
					if (activeLog[0]) {
						console.log('>>> Errore! Attività già in corso!');
						return next(
							new HttpError(
								`Impossibile avviare una nuova attività. Già attivo: ${activeLog[1]}`,
								404
							)
						);
					}
					log.startWork = new Date();
					log.status = 'ONGOING';
					console.log('<<< Invio comando START per log: ' + logId);
					break;
				case 'ONGOING':
					log.startBreak = new Date();
					log.status = 'PAUSED';
					console.log('<<< Invio comando PAUSE per log: ' + logId);
					break;
				case 'PAUSED':
					if (activeLog[0]) {
						console.log('>>> Errore! Attività già in corso!');
						return next(
							new HttpError(
								`Impossibile avviare una nuova attività. Già attivo: ${activeLog[1]}`,
								404
							)
						);
					}
					const delta = new Date() - log.startBreak;
					log.breaksTime += delta;
					log.status = 'ONGOING';
					console.log('<<< Invio comando RESUME per log: ' + logId);
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
			log.endWork = new Date();
			if (log.status === 'PAUSED') {
				const delta = new Date() - log.startBreak;
				log.breaksTime += delta;
				console.log(
					'> Calcolo tempo di pausa prima di eseguire STOP: ' + logId
				);
			}
			let minWorked = (log.endWork - log.startWork - log.breaksTime) / 60000;
			console.log('<<< Invio comando STOP per log: ' + logId);
			if (minWorked > 0) {
				log.minWorked = minWorked.toFixed();
			}
			console.log('<<< Invio tempo lavorato a Progetto:' + log.projectId);
			Project.findOne({ _id: log.projectId })
				.then(project => {
					project.addWorkedTime(log.minWorked);
				})
				.catch(err => {
					console.log(err);
				});
			log.workSummary = req.body.workSummary;
			log.status = 'COMPLETED';
			log.summaryIsNeeded = req.body.summaryIsNeeded;
			// return;
			log.save().then(status => res.status(201).json({ status }));
		})
		.catch(err => {
			console.log(err);
		});
};

exports.getCustomerLogs = (req, res, next) => {
	const customerId = req.params.custId;
	console.log(req.params);
	Log.find({ contactId: customerId })
		.sort({ startWork: -1 })
		// .limit(10)
		.then(logs => {
			res.status(201).json({ logs });
		})
		.catch(err => {
			console.log(err);
		});
};

exports.getProjectsLogs = (req, res, next) => {
	const projectId = req.params.projectId;
	Log.find({ projectId: projectId })
		.sort({ _id: -1 })
		.limit(10)
		.then(projectLogs => {
			console.log('>>> Rispondo logs per progetto:' + projectId);
			res.status(201).json({ projectLogs });
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

exports.getDailyPlan = async (req, res, next) => {
	console.log(Number(req.params.day));
	const day = new Date(Number(req.params.day));
	// console.log(day.setHours(0, 0, 0));
	let minDate = new Date(
		day.getFullYear(),
		day.getMonth(),
		day.getDate(),
		0,
		0,
		0
	);
	let maxDate = new Date(
		day.getFullYear(),
		day.getMonth(),
		day.getDate(),
		23,
		59,
		59
	);

	console.log(minDate);
	console.log(maxDate);

	// if (!day) return;
	const logs = await Log.find({
		dueDate: {
			$gte: minDate,
			$lte: maxDate,
		},
	}).sort({ dueDate: 1 });
	res.status(201).json({ logs: logs });
	// res.status(201).json('ok');
};
