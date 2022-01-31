import React from 'react';

import classes from './Card.module.css';

function Card({ cardData, clickHandler, stateToHandle, setResultState }) {
	const cardResutlHandler = () => {
		// setResultState(cardData);
		clickHandler(!stateToHandle);
	};

	if (!cardData) {
		return (
			<div
				className={classes.card}
				key={cardData?._id}
				onClick={cardResutlHandler}
			>
				<div className={classes.list} key={0}>
					<h2>Crea nuova attività</h2>
				</div>
			</div>
		);
	}

	return (
		<div
			className={classes.card}
			key={cardData?._id}
			onClick={cardResutlHandler}
		>
			<div className={classes.list} key={cardData?._id}>
				<p className={classes.data}>{cardData?.date}</p>
				<h2>{cardData?.title}</h2>
				<p className={classes.description}>{cardData?.description}</p>
				<p className={`${classes.workType} ${classes[cardData?.status]}`}>
					{cardData?.workType}
				</p>
				<p className={classes.status}>{cardData?.status}</p>
			</div>
		</div>
	);
}
export default Card;
