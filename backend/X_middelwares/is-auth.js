//Redirect to login page
const jwt = require('jsonwebtoken');

const HttpError = require('../O_models/m_error');

module.exports = (req, res, next) => {
	if (req.method === 'OPTIONS') {
		return next();
	}
	if (req.headers.authorization) {
		const token = req.headers.authorization.split(' ')[1];
		if (!token) {
			return next(new HttpError('Errore autenticazione', 401));
			// console.log('ERROR ->> Not Logged');
			// res.status(400);
		} else {
			const decToken = jwt.verify(token, 'StringThatSetTheTokenSecurityLevel');
			console.log('Route avaiable ->');
			req.user = { userId: decToken.userId };
			next();
		}
	} else {
		return next(new HttpError('Operazione non autorizzata', 401));
		// console.log('ERROR ->> No token found');
		// res.status(400);
	}
};
