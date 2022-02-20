import React, { useState } from 'react';

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
				<div className={classes.first} key={0}>
					<h2>Crea nuova attività</h2>
				</div>
			</div>
		);
	} else {
		const getDueDate = () => {
			return new Date(cardData?.dueDate).toLocaleString('it-IT', {
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

		const convertToHour = () => {
			const timeFormat = n => ('00' + n).slice(-2);
			let min = cardData.minWorked;
			let hour = Math.floor(min / 60);
			min = min - hour * 60;
			return timeFormat(hour) + ':' + timeFormat(min);

			// let mill = cardData.minWorked * 60000;
		};

		return (
			<div className={classes.card} key={cardData?._id}>
				<div className={classes.list} key={cardData?._id}>
					<div className={classes.description}>
						<p className={`${classes.workType} ${classes[cardData?.status]}`}>
							{cardData?.workType}
						</p>
						<p className={classes.date}>{getDueDate()}</p>
						{cardData?.workDescription}
						<hr />
						{cardData.endWork && <p className={classes.date}>{getEndDate()}</p>}
						{cardData?.workSummary}
					</div>
					{cardData?.status !== 'COMPLETED' ? (
						<Controlls
							status={cardStatus}
							setCardStatus={setCardStatus}
							log={cardData}
							statusToControl={cardStatus}
						/>
					) : (
						<p>Impiegato: {convertToHour()}</p>
					)}
				</div>
			</div>
		);
	}
}
export default Card;
