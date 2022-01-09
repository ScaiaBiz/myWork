const Project = require('./../O_models/m_projects');
const ObjectId = require('mongoose').Types.ObjectId;

exports.postNewProject = (req, res, next) => {
	if (!req.body.activityId) {
		//TODO: Crerare attività?
	}

	if (!req.body.projectId) {
		//TODO: Creare progetto?
	}

	const project = new Project({
		customerId: req.body.customerId,
		title: req.body.title,
		description: req.body.description,
		workType: req.body.workType,
	});
	project
		.save()
		.then(p => res.status(201).json({ p }))
		.catch(err => {
			console.log(err);
			res.status(400).json({ err });
		});
};

exports.getCustomerProjects = (req, res, next) => {
	const customerId = req.params.custId;
	Project.find({ customerId: customerId })
		.sort({ _id: -1 })
		.limit(10)
		.then(projects => {
			res.status(201).json({ projects });
		})
		.catch(err => {
			console.log(err);
		});
};

exports.getProjects = (req, res, next) => {
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
