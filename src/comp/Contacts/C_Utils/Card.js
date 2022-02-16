import React, { useState, useEffect } from 'react';

import Controlls from '../../../utils/controlls/Controlls';

import classes from './Card.module.css';

function Card({
	cardData,
	clickHandler,
	stateToHandle,
	setResultState,
	parentId,
	postPlay,
	pause,
	stop,
}) {
	const cardResutlHandler = () => {
		// setResultState(cardData);
		clickHandler(!stateToHandle);
	};

	const [cardStatus, setCardStatus] = useState(null);
	if (cardStatus?.endWork) {
		cardData.endWork = cardStatus.endWork;
	}

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
	} else {
		const getDueDate = () => {
			new Date(cardData?.dueDate).toLocaleString('it-IT', {
				day: '2-digit',
				month: '2-digit',
				year: 'numeric',
				hour: '2-digit',
				minute: '2-digit',
			});
		};

		const getEndDate = () => {
			return new Date(cardData?.endWork).toLocaleString('it-IT', {
				day: '2-digit',
				month: '2-digit',
				year: 'numeric',
				hour: '2-digit',
				minute: '2-digit',
			});
		};

		return (
			<div className={classes.card} key={cardData?._id}>
				<div className={classes.list} key={cardData?._id}>
					<p className={`${classes.workType} ${classes[cardData?.status]}`}>
						{cardData?.workType}
					</p>
					<p className={classes.data}>{getDueDate()}</p>
					<h2>{cardData?.title}</h2>
					<div className={classes.description}>
						{cardData?.workDescription}
						<br />
					</div>
					{/* {cardData?.status !== 'COMPLETED' ? ( */}
					<Controlls
						status={cardStatus}
						setCardStatus={setCardStatus}
						log={cardData}
					/>
					{/* ) : ( */}
					<p className={classes.data}>{getEndDate()}</p>
					{/* )} */}
				</div>
			</div>
		);
	}
}
export default Card;
