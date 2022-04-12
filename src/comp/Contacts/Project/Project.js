import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

import { useHttpClient } from './../../../hooks/http-hooks';
import LoadingSpinner from '../../../utils/LoadingSpinner';
import ErrorModal from '../../../utils/ErrorModal';
import Backdrop from '../../../utils/Backdrop';

import Card from '../C_Utils/Card';
import NewLog from './Elements/NewLog';

import classes from './Project.module.css';

function Project({ project }) {
	const [toLoad, setToLoad] = useState(true);
	const [contact, setContact] = useState(null);
	const [logs, setLogs] = useState(null);
	const [showNewLogForm, setShowNewLogForm] = useState(false);

	const { isLoading, error, sendRequest, clearError } = useHttpClient();

	/**-----------------
	 * LOADING
	 * ----------------*/

	const getProjectLogs = async () => {
		const logs = await sendRequest(`api/log/logs/${project._id}`);
		const l = logs.projectLogs.map(log => {
			return <Card cardData={log} pause={''} stop={''} />;
		});
		setLogs(l);
		return setToLoad(false);
	};

	const getContact = async () => {
		const c = await sendRequest(`api/contacts/${project.contactId}`);
		setContact(c.c);
	};

	useEffect(() => {
		if (toLoad) {
			if (!contact) {
				getContact();
			}
			getProjectLogs();
		}
	}, [toLoad, contact, getContact]);

	/**-----------------
	 * INVIO DATI
	 * ----------------*/

	const addNewHandler = () => {
		setShowNewLogForm(!showNewLogForm);
		if (showNewLogForm) {
			console.log('Modificlo TO LOAD');
			setToLoad(true);
		}
	};

	const addNewLog = () => {
		const formNewLog = (
			<React.Fragment>
				<Backdrop onClick={addNewHandler} level='secondo' />
				<NewLog
					clear={addNewHandler}
					succes={setToLoad}
					projectId={project._id}
					projectTitle={project.title}
					contactId={contact._id}
				/>
			</React.Fragment>
		);
		return ReactDOM.createPortal(
			formNewLog,
			document.getElementById('modal-hook_2')
		);
	};

	const showProjectData = () => {
		return (
			<div className={classes.container}>
				<div className={classes.header}>
					<div className={classes.header__title}>
						{contact?.name}
						<h1 className={classes.headerH1}>{project.title}</h1>
						<p className={classes[project.status]}>{project.status}</p>
						TL: {project.totalTimeWorked} - DF: {project.totalTimeToInvoice} -
						TF: {project.totalTimeInvoiced}
					</div>
					<div className={classes.description}>{project.description}</div>
				</div>
				<div className={classes.logs}>
					<Card
						clickHandler={addNewHandler}
						stateToHandle={setShowNewLogForm}
					/>
					{logs}
				</div>
			</div>
		);
	};

	return (
		<React.Fragment>
			{error && <ErrorModal error={error} onClear={clearError} />}
			{isLoading && <LoadingSpinner asOverlay />}
			{showNewLogForm && addNewLog()}
			{!toLoad && showProjectData()}
		</React.Fragment>
	);
}

export default Project;
