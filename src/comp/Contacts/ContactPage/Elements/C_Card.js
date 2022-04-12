import React from 'react';

import classes from './C_Card.module.css';

function C_Card({
	type,
	cardData,
	clickHandler,
	stateToHandle,
	setResultState,
}) {
	const cardResutlHandler = () => {
		setResultState(cardData);
		clickHandler(!stateToHandle);
	};

	// const getProjectName

	switch (type) {
		case 'project':
			return (
				<div
					className={classes.card}
					key={cardData._id}
					onClick={cardResutlHandler}
				>
					<div className={classes.list} key={cardData._id}>
						<h2>{cardData.title}</h2>
						TL: {cardData.totalTimeWorked} - DF: {cardData.totalTimeToInvoice} -
						TF: {cardData.totalTimeInvoiced}
						<p className={classes.description}>{cardData.description}</p>
						<p className={`${classes.workType} ${classes[cardData.status]}`}>
							{cardData.workType}
						</p>
					</div>
				</div>
			);

		case 'logs':
			console.log(cardData);
			return (
				<div
					className={classes.card}
					key={cardData._id}
					onClick={cardResutlHandler}
				>
					<div className={classes.list} key={cardData._id}>
						<h2>{cardData.title}</h2>
						<p className={classes.description}>{cardData.workDescription}</p>
						TL: {cardData.minWorked} - DF: {cardData.minToInvoice}
						<p className={`${classes.workType} ${classes[cardData.status]}`}>
							{cardData.workType}
						</p>
					</div>
				</div>
			);
		default:
			return (
				<div
					className={classes.card}
					key={cardData._id}
					onClick={cardResutlHandler}
				>
					<div className={classes.list} key={cardData._id}>
						<h2>{cardData.title}</h2>
						TL: {cardData.totalTimeWorked} - DF: {cardData.totalTimeToInvoice} -
						TF: {cardData.totalTimeInvoiced}
						<p className={classes.description}>{cardData.description}</p>
						<p className={`${classes.workType} ${classes[cardData.status]}`}>
							{cardData.workType}
						</p>
					</div>
				</div>
			);
	}
}

export default C_Card;
