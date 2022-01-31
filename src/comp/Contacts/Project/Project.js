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
		// console.log(project._id);
		const l = await sendRequest(`api/log/logs/${project._id}`);
		setLogs(l.projectLogs);
		return;
	};

	const getContact = async () => {
		const c = await sendRequest(`api/contacts/${project.contactId}`);
		setContact(c.c);
	};

	useEffect(() => {
		if (toLoad) {
			console.log(project);
			getContact();
			getProjectLogs();

			setToLoad(false);
		}
		// }, []);
	}, [toLoad]);

	/**-----------------
	 * INVIO DATI
	 * ----------------*/

	const postNewActivity = () => {};

	const addNewHandler = () => {
		setShowNewLogForm(!showNewLogForm);
	};

	const addNewLog = () => {
		console.log('Nuova attività?');
		const formNewContat = (
			<React.Fragment>
				<Backdrop onClick={addNewHandler} level='secondo' />
				<NewLog clear={addNewHandler} succes={setToLoad} />
			</React.Fragment>
		);
		return ReactDOM.createPortal(
			formNewContat,
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

	/**
	 * Header
	 * 	Project data
	 * 	Client
	 * Logs
	 * 	Activity logs
	 */
}

export default Project;
