import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useParams } from 'react-router-dom';

import { useHttpClient } from './../../../../hooks/http-hooks';
import LoadingSpinner from '../../../../utils/LoadingSpinner';
import ErrorModal from '../../../../utils/ErrorModal';
import Backdrop from '../../../../utils/Backdrop';

import C_Card from './C_Card';
import Project from '../../Project/Project';
import NewProject from '../../Project/NewProject';

import classes from './C_Projects.module.css';

function ContactProjects() {
	const param = useParams();
	const [cid, setCid] = useState(param.contactId);
	const [projects, setProjects] = useState(null);
	const [showProjectCard, setShowProjectCard] = useState(false);
	const [showNewProjectForm, setShowNewProjectForm] = useState(false);
	const [selectedProjectIdCard, setSelectedProjectIdCard] = useState(null);

	const { isLoading, error, sendRequest, clearError } = useHttpClient();

	const showProjecCardHandler = () => {
		setShowProjectCard(!showProjectCard);
	};

	const showNewProjectFormHandler = reload => {
		console.log(reload);
		setShowNewProjectForm(!showNewProjectForm);
		if (reload) {
			getProjects();
		}
	};

	const getProjects = async () => {
		const p = await sendRequest(`api/project/getProjects/${cid}`);
		const projects = p.projects.map(project => {
			return (
				<C_Card
					type='project'
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

	const openNewProjectForm = () => {
		const newProjectCard = (
			<React.Fragment>
				<Backdrop onClick={showNewProjectFormHandler} />
				<NewProject
					clear={showNewProjectFormHandler}
					contactId={cid}
					reload={showProjecCardHandler}
				/>
			</React.Fragment>
		);
		return ReactDOM.createPortal(
			newProjectCard,
			document.getElementById('modal-hook')
		);
	};

	return (
		<React.Fragment>
			{error && <ErrorModal error={error} onClear={clearError} />}
			{isLoading && <LoadingSpinner asOverlay />}
			{showProjectCard && openProjectCard()}
			{showNewProjectForm && openNewProjectForm()}

			<div className={classes.container}>
				<div className={classes.header}>
					<div
						className={classes.header__content}
						onClick={showNewProjectFormHandler}
					>
						Aggiungi Nuovo
					</div>
					{/* <div className={classes.header__content}>Interruttori di filtro</div>
					<div className={classes.header__content}>Altro</div> */}
				</div>
				{projects}
			</div>
		</React.Fragment>
	);
}

export default ContactProjects;
