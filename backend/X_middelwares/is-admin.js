//Redirect to login page
const jwt = require('jsonwebtoken');

const HttpError = require('../O_models/m_error');

module.exports = (req, res, next) => {
	console.log(req.body);
	if (req.method === 'OPTIONS') {
		return next();
	}
	if (req.headers.authorization && req.body.isAdmin) {
		const token = req.headers.authorization.split(' ')[1];
		if (!token) {
			return next(new HttpError('Errore autenticazione', 401));
		} else {
			const decToken = jwt.verify(token, 'StringThatSetTheTokenSecurityLevel');
			console.log('Admin route avaiable ->');
			req.user = { userId: decToken.userId };
			next();
		}
	} else {
		return next(
			new HttpError(
				'Operazione non autorizzata o credenziali insufficienti',
				401
			)
		);
	}
};
