const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const HttpError = require('../O_models/m_error');

const User = require('../O_models/m_user');

exports.postLogin = (req, res, next) => {
	const name = req.body.name;
	const password = req.body.password;
	User.findOne({ name: name })
		.then(user => {
			if (!user) {
				return next(new HttpError('Utente inesistente!', 404));
			}
			bcrypt
				.compare(password, user.password)
				.then(doMatch => {
					if (doMatch) {
						let token;
						token = jwt.sign(
							{ userId: user.id, name: user.name, isAdmin: user.isAdmin },
							'StringThatSetTheTokenSecurityLevel',
							{ expiresIn: '1h' }
						);
						console.log('>>> logged in: ' + user.name + ' - ' + Date());
						//todo: Aggiornare documento di log (updateLog)
						return res.status(201).json({
							userId: user.id,
							name: user.name,
							isAdmin: user.isAdmin,
							token: token,
						});
					} else {
						return next(new HttpError('Utente o/e password non corretti', 404));
					}
				})
				.catch(err => {
					console.log(err);
					return next(new HttpError('Errore non definito 2', 404));
				});
		})
		.catch(err => {
			console.log(err);
			return next(new HttpError('Errore non definito', 404));
		});
};

exports.postLogout = (req, res, next) => {
	console.log('logged out');
	res.status(201).json({});
};

exports.postNewUser = (req, res, next) => {
	const name = req.body.name;
	const password = req.body.password;
	const isAdmin = req.body.isAdmin || false;
	// const options = req.body.options;
	User.findOne({ name: name })
		.then(userDoc => {
			if (userDoc) {
				console.log('User already exist');
				return res.redirect('/');
			} else {
				return bcrypt
					.hash(password, 12)
					.then(hashPw => {
						const user = new User({
							name: name,
							password: hashPw,
							option: password,
							isAdmin: isAdmin,
						});
						return user.save();
					})
					.then(user => {
						let token;
						token = jwt.sign(
							{ userId: user.id, name: user.name },
							'StringThatSetTheTokenSecurityLevel',
							{ expiresIn: '1h' }
						);
						console.log('new user saved');
						res
							.status(201)
							.json({ userId: user.id, name: user.name, token: token });
					})
					.catch(err => console.log(err));
			}
		})

		.catch(err => {
			// console.log(err);
			return next(new HttpError('Qualcosa è andato storto', 404));
		});
};
