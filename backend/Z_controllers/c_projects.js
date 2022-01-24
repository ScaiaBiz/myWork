const Project = require('./../O_models/m_projects');
const ObjectId = require('mongoose').Types.ObjectId;

exports.postNewProject = (req, res, next) => {
	const data = req.body;
	const project = new Project({
		contactId: data.contactId,
		referent: data.referent,
		title: data.title,
		description: data.description,
		workType: data.workType,
		status: data.status || 'active',
		creationDate: data.creationDate,
		startDate: data.startDate || data.creationDate,
		dueDate: data.dueDate,
		endDate: data.endDate,
	});
	project
		.save()
		.then(p => res.status(201).json({ p }))
		.catch(err => {
			console.log(err);
			res.status(400).json({ err });
		});
};

exports.getContactProjects = (req, res, next) => {
	const contactId = req.params.contactId;
	Project.find({ contactId: contactId })
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
