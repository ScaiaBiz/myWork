const express = require('express');
const mongoose = require('mongoose');

const cors = require('cors');

//Debug variables
let testing = false;

//Import models
// const User = require('./O_models/m_user');
const HttpError = require('./O_models/m_error');

//Import routers
const authRts = require('./Y_routers/api/r_auth');
const adminRts = require('./Y_routers/api/r_admin');
const contactsRts = require('./Y_routers/api/r_contacts');
const logWorksRts = require('./Y_routers/api/r_logWorks');
const projectsRts = require('./Y_routers/api/r_projects');
// const activityRts = require('./Y_routers/api/r_activity');

//Set base data
const appName = process.env.npm_package_config_dbname;
const db_loc = process.env.npm_package_config_dblocal;
const port = process.env.npm_package_config_port;
const MONGODB_URI = `${db_loc}/${appName}`;
const SRV_PORT = process.env.PORT || port;
console.log('descr: ' + process.env.npm_package_config_dbname);
console.log('port: ' + process.env.npm_package_config_port);
console.log('port: ' + process.env.npm_package_config_dblocal);

//Start express
const app = express();

//CORS handler
app.use(cors());

//Parse request
app.use(express.json());

//Eval routes
app.use('/api/admin', adminRts);
app.use('/api/contacts', contactsRts);
app.use('/api/log', logWorksRts);
app.use('/api/project', projectsRts);
// app.use('/api/activity', activityRts);
app.use('/', authRts);

//Error handler
//>> Check route
app.use((req, res, next) => {
	// console.log(req);
	return next(
		new HttpError('No route found: ' + req.method + ' ' + req.url, 404)
	);
});
//>> Response error
app.use((error, req, res, next) => {
	if (res.headerSent) {
		return next(error);
	}
	// console.log(error.message);
	return res
		.status(error.code || 500)
		.json({ message: error.message || 'Unknown error', errorStatus: true });
});

//DB connection and SERVER starting
mongoose
	.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => console.log('MongoDB connected!'))
	.then(result => {
		app.listen(SRV_PORT);
		console.log('Server up on port: ' + SRV_PORT);
	})
	.catch(err => {
		console.log(err);
	});
