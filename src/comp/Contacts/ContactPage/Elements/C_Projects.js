import React, { useState, useEffect } from 'react';
import { useParams, Outlet } from 'react-router-dom';

import { useHttpClient } from './../../../../hooks/http-hooks';
import LoadingSpinner from '../../../../utils/LoadingSpinner';
import ErrorModal from '../../../../utils/ErrorModal';

import C_SingleCard from './C_SingleCard';

import classes from './C_Projects.module.css';

function ContactProjects() {
	const param = useParams();
	const [showNewProjectForm, setShowNewProjectForm] = useState(false);
	const [activeProjects, setActiveProjects] = useState(null);

	const { isLoading, error, sendRequest, clearError } = useHttpClient();

	const getProjects = async () => {
		const p = await sendRequest(`api/project/getProjects/${param.contactId}`);
		const projects = p.projects.map(projet => {
			return (
				<div className={classes.card} key={projet._id}>
					<div className={classes.list} key={projet._id}>
						<h2>{projet.title}</h2>
						<p>{projet.description}</p>
					</div>
				</div>
			);
		});
		setActiveProjects(projects);
	};

	useEffect(() => {
		getProjects();
	}, []);

	const addNewProject = () => {
		console.log('Avviato nuovo progetto');
	};

	return (
		<React.Fragment>
			{error && <ErrorModal error={error} onClear={clearError} />}
			{isLoading && <LoadingSpinner asOverlay />}
			{showNewProjectForm && addNewProject()}

			<div className={classes.container}>
				<div className={classes.header}>
					<p className={classes.header__content}>
						Aggiungi Nuovo | Interruttori di filtro | Altro
					</p>
				</div>
				{activeProjects}
			</div>
		</React.Fragment>
	);
}

export default ContactProjects;
