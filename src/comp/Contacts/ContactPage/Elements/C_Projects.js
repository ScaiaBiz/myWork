import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useParams, Outlet } from 'react-router-dom';

import { useHttpClient } from './../../../../hooks/http-hooks';
import LoadingSpinner from '../../../../utils/LoadingSpinner';
import ErrorModal from '../../../../utils/ErrorModal';
import Backdrop from '../../../../utils/Backdrop';

import C_Card from './C_Card';
import Project from '../../Project/Project';

import classes from './C_Projects.module.css';

function ContactProjects() {
	const param = useParams();
	const [projects, setProjects] = useState(null);
	const [showProjectCard, setShowProjectCard] = useState(false);
	const [selectedProjectIdCard, setSelectedProjectIdCard] = useState(null);

	const { isLoading, error, sendRequest, clearError } = useHttpClient();

	const showProjecCardHandler = () => {
		setShowProjectCard(!showProjectCard);
	};

	const getProjects = async () => {
		const p = await sendRequest(`api/project/getProjects/${param.contactId}`);
		const projects = p.projects.map(project => {
			return (
				<C_Card
					key={project._id}
					cardData={project}
					clickHandler={showProjecCardHandler}
					stateToHandle={showProjectCard}
					setResultState={setSelectedProjectIdCard}
				/>
			);
		});
		setProjects(projects);
	};

	useEffect(() => {
		if (!showProjectCard) {
			getProjects();
		}
	}, [showProjectCard]);

	const openProjectCard = () => {
		const projectCard = (
			<React.Fragment>
				<Backdrop onClick={showProjecCardHandler} />
				<Project
					clear={showProjecCardHandler}
					project={selectedProjectIdCard}
				/>
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
		</React.Fragment>
	);
}

export default ContactProjects;
