const Contact = require('./../O_models/m_contact');

exports.createCustomer = (req, res, next) => {
	//initials
	const getInitials = () => {
		const name = req.body.name.toUpperCase().split(' ');
		if (name.length >= 2 && name[1].length > 3) {
			return name[0][0] + name[1][0];
		} else {
			return name[0][0] + name[0][1];
		}
	};

	const customer = new Contact({
		name: req.body.name,
		initials: getInitials(),
		bg_color: '#ff0000',
		address: {
			street: req.body.street,
			number: req.body.number,
			city: req.body.city,
			postCode: req.body.postCode,
			nation: req.body.nation,
		},
	});

	customer
		.save()
		.then(c => res.status(201).json({ c }))
		.catch(err => console.log(err));
};

exports.getContacts = (req, res, next) => {
	Contact.find()
		.then(c => {
			res.status(201).json({ c });
		})
		.catch(err => {
			console.log(err);
		});
};

exports.getCustomer = (req, res, next) => {
	Contact.findById(req.params.id).then(c => {
		res.status(201).json({ c });
	});
};
