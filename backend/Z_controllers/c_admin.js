const Setting = require('../O_models/m_settings');

exports.postLogin = (req, res, next) => {};

exports.postSettings = (req, res, next) => {
	Text.create({ name: req.body.text, value: req.body.settings })
		.then(setting => res.json(setting))
		.catch(err => {
			console.log(err);
		});
};

exports.getSettings = (req, res, next) => {
	Setting.find()
		.then(setting => {
			res.json(setting);
		})
		.catch(err => {
			console.log(err);
		});
};
