import React from 'react';

import classes from './C_Card.module.css';

function C_Card({ project, handleClick, state }) {
	return (
		<div
			className={classes.card}
			key={project._id}
			onClick={() => handleClick(!state)}
		>
			<div className={classes.list} key={project._id}>
				<h2>{project.title}</h2>
				<p className={classes.description}>{project.description}</p>
				<p className={`${classes.workType} ${classes[project.status]}`}>
					{project.workType}
				</p>
			</div>
		</div>
	);
}

export default C_Card;
