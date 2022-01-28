import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useParams, Outlet } from 'react-router-dom';

import { useHttpClient } from './../../../../hooks/http-hooks';
import LoadingSpinner from '../../../../utils/LoadingSpinner';
import ErrorModal from '../../../../utils/ErrorModal';
import Backdrop from '../../../../utils/Backdrop';

import Project from '../../Project/Project';

import classes from './C_Projects.module.css';

function ContactProjects() {
	const param = useParams();
	const [projects, setProjects] = useState(null);
	const [showProjectCard, setShowProjectCard] = useState(false);
	const [selectedProjectIdCard, setSelectedProjectIdCard] = useState(null);

	const { isLoading, error, sendRequest, clearError } = useHttpClient();

	const showProjecCardHandler = () => setShowProjectCard(!showProjectCard);

	const getProjects = async () => {
		const p = await sendRequest(`api/project/getProjects/${param.contactId}`);
		const projects = p.projects.map(projet => {
			return (
				<div
					className={classes.card}
					key={projet._id}
					onClick={showProjecCardHandler}
				>
					<div className={classes.list} key={projet._id}>
						<h2>{projet.title}</h2>
						<p className={classes.description}>{projet.description}</p>
						<p className={`${classes.workType} ${classes[projet.status]}`}>
							{projet.workType}
						</p>
					</div>
				</div>
			);
		});
		setProjects(projects);
	};

	useEffect(() => {
		getProjects();
	}, [showProjectCard]);

	const openProjectCard = () => {
		const projectCard = (
			<React.Fragment>
				<Backdrop onClick={showProjecCardHandler} />
				<Project clear={showProjecCardHandler} />
			</React.Fragment>
		);
		return ReactDOM.createPortal(
			projectCard,
			document.getElementById('modal-hook')
		);
	};

	return (
		<React.Fragment>
			{error && <ErrorModal error={error} onClear={clearError} />}
			{isLoading && <LoadingSpinner asOverlay />}
			{showProjectCard && openProjectCard()}

			<div className={classes.container}>
				<div className={classes.header}>
					<p className={classes.header__content}>
						Aggiungi Nuovo | Interruttori di filtro | Altro
					</p>
				</div>
				{projects}
			</div>
			{showProjectCard.toString()}
		</React.Fragment>
	);
}

export default ContactProjects;
