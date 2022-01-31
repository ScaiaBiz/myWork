import React from 'react';

import classes from './C_Card.module.css';

function C_Card({ cardData, clickHandler, stateToHandle, setResultState }) {
	const cardResutlHandler = () => {
		setResultState(cardData);
		clickHandler(!stateToHandle);
	};

	return (
		<div
			className={classes.card}
			key={cardData._id}
			onClick={cardResutlHandler}
		>
			<div className={classes.list} key={cardData._id}>
				<h2>{cardData.title}</h2>
				<p className={classes.description}>{cardData.description}</p>
				<p className={`${classes.workType} ${classes[cardData.status]}`}>
					{cardData.workType}
				</p>
			</div>
		</div>
	);
}

export default C_Card;
