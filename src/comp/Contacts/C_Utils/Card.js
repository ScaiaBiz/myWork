import React, { useState, useContext } from 'react';

import { UserCxt } from '../../../cxt/UserCxt';

import Controlls from '../../../utils/controlls/Controlls';
import IconController from '../../../utils/IconController';

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
	type,
}) {
	const cardResutlHandler = () => {
		clickHandler(!stateToHandle);
	};

	const [cardStatus, setCardStatus] = useState(cardData);

	//Calendar: Aprire direttamente lista TODO del progetto di riferimento
	const [showTodosCxt, setShowTodosCxt] = useContext(UserCxt).showProjectTodos;
	const [projectCtx, setProjectCtx] = useContext(UserCxt).ProjectTodos;

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
			return new Date(cardStatus?.endWork).toLocaleString('it-IT', {
				day: '2-digit',
				month: '2-digit',
				year: 'numeric',
				hour: '2-digit',
				minute: '2-digit',
			});
		};

		const convertToHour = () => {
			const timeFormat = n => ('00' + n).slice(-2);
			let min = cardStatus.minWorked;
			let hour = Math.floor(min / 60);
			min = min - hour * 60;
			return timeFormat(hour) + ':' + timeFormat(min);
		};

		const formatTime = time => {
			return new Date(time).toLocaleString('it-IT', {
				// day: '2-digit',
				// month: '2-digit',
				// year: 'numeric',
				hour: '2-digit',
				minute: '2-digit',
			});
		};

		const getTodoList = () => {
			setProjectCtx({ id: cardData?.projectId, title: cardData?.title });
			setShowTodosCxt(true);
		};

		switch (type) {
			case 'CALENDAR':
				return (
					<div
						key={cardData?._id}
						className={`${classes.task} ${classes[cardData?.status]} ${
							classes[cardStatus]
						}`}
					>
						<div className={classes.cheklist}>
							<IconController
								type='CHEKLIST'
								color='black'
								action={getTodoList}
							/>
						</div>
						Avvio:{' '}
						{cardData?.startWork
							? formatTime(cardData?.startWork)
							: formatTime(cardData?.dueDate)}
						<br />
						{cardData?.endWork && 'Stop: ' + formatTime(cardData?.endWork)}
						{cardData?.endWork && <br />}
						<p className={classes.calendar_pTitle}>{cardData?.title}</p>{' '}
						<p>{cardData?.workDescription}</p>
						<br />
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
				);

			default:
				return (
					<div className={classes.card} key={cardData?._id}>
						<div className={classes.list} key={cardData?._id}>
							<div className={classes.description}>
								<p
									className={`${classes.workType} ${classes[cardData?.status]}`}
								>
									{cardData?.workType}
								</p>
								<p className={classes.date}>{getDueDate()}</p>
								{cardData?.workDescription}
								<hr />
								{cardStatus.endWork && (
									<p className={classes.date}>{getEndDate()}</p>
								)}
								{cardStatus?.workSummary}
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
}
export default Card;
