import React, { useState, useContext, useEffect } from 'react';
import ReactDOM from 'react-dom';

import { UserCxt } from '../../../cxt/UserCxt';

import Controlls from '../../../utils/controlls/Controlls';
import IconController from '../../../utils/IconController';
import RegManual from '../../Calendar/RegManual/RegManual';

import { useHttpClient } from '../../../hooks/http-hooks';
import LoadingSpinner from '../../../utils/LoadingSpinner';
import ErrorModal from '../../../utils/ErrorModal';
import Backdrop from '../../../utils/Backdrop';

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

	const { isLoading, error, sendRequest, clearError } = useHttpClient();

	const [cardStatus, setCardStatus] = useState(cardData);

	//Calendar: Aprire direttamente lista TODO del progetto di riferimento
	const [showTodosCxt, setShowTodosCxt] = useContext(UserCxt).showProjectTodos;
	const [projectCtx, setProjectCtx] = useContext(UserCxt).ProjectTodos;

	const [showRegManual, setShowRegManual] = useState(false);

	const handleShowRegManual = () => {
		setShowRegManual(!showRegManual);
	};

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
	}
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

	const convertToHour = value => {
		const timeFormat = n => ('00' + n).slice(-2);
		let min = value;
		let hour = Math.floor(min / 60);
		min = min - hour * 60;
		return timeFormat(hour) + ':' + timeFormat(min);
	};

	const fromMillisecondsToHours = value => {
		return convertToHour(Math.round(value / 60000));
	};

	const formatTime = time => {
		return new Date(time).toLocaleString('it-IT', {
			hour: '2-digit',
			minute: '2-digit',
		});
	};

	const evalActualTime = () => {
		if (cardStatus?.status === 'ONGOING' || cardStatus?.status === 'PAUSED') {
			const t_now = new Date();

			let actulaTimeWorked =
				Date.parse(t_now) - Date.parse(new Date(cardStatus.startWork));

			let t_breaks = 0;
			if (cardStatus?.startBreak && cardStatus?.status === 'PAUSED') {
				t_breaks = t_now - Date.parse(new Date(cardStatus.startBreak));
				// console.log({ t_breaks });
			}
			if (cardStatus?.breaksTime) {
				t_breaks += Number(cardStatus.breaksTime);
				// console.log({ t_breaks });
			}
			actulaTimeWorked -= t_breaks;
			// console.log({ actulaTimeWorked });
			return <p>Dedicato: {fromMillisecondsToHours(actulaTimeWorked)}</p>;
		}
	};

	const getTodoList = () => {
		setProjectCtx({ id: cardData?.projectId, title: cardData?.title });
		setShowTodosCxt(true);
	};

	const insertRegistration = () => {
		console.log('Inserimento manuale dati');
		const askWorkedTime = (
			<RegManual
				clear={handleShowRegManual}
				day={cardData?.startWork || cardData?.dueDate}
				cardStatus={cardStatus}
				setCardStatus={setCardStatus}
				setReload={() => console.log('Tento reload')}
			/>
		);

		return ReactDOM.createPortal(
			askWorkedTime,
			document.getElementById('ask-layer')
		);
	};

	switch (type) {
		case 'CALENDAR':
			return (
				<React.Fragment>
					{error && <ErrorModal error={error} onClear={clearError} />}
					{isLoading && <LoadingSpinner asOverlay />}
					{showRegManual && insertRegistration()}
					<div
						key={cardData?._id}
						className={`${classes.task} ${classes[cardStatus?.status]} ${
							classes[cardStatus]
						}`}
					>
						<div className={classes.logManual}>
							<IconController
								type='MANUALREG'
								color='black'
								action={handleShowRegManual}
							/>
						</div>
						<div className={classes.cheklist}>
							<IconController
								type='CHEKLIST'
								color='black'
								action={getTodoList}
							/>
						</div>
						Avvio:{' '}
						{cardStatus?.startWork
							? formatTime(cardStatus?.startWork)
							: formatTime(cardStatus?.dueDate)}
						<br />
						{cardStatus?.endWork && 'Stop: ' + formatTime(cardStatus?.endWork)}
						{cardStatus?.endWork && <br />}
						<p className={classes.calendar_pTitle}>{cardData?.title}</p>{' '}
						<p>{cardStatus?.workDescription}</p>
						<br />
						{cardStatus?.status !== 'COMPLETED' ? (
							<React.Fragment>
								{evalActualTime()}
								<Controlls
									status={cardStatus}
									setCardStatus={setCardStatus}
									log={cardStatus}
									statusToControl={cardStatus}
								/>
							</React.Fragment>
						) : (
							<p>Impiegato: {convertToHour(cardStatus.minWorked)}</p>
						)}
					</div>
				</React.Fragment>
			);

		default:
			return (
				<React.Fragment>
					{error && <ErrorModal error={error} onClear={clearError} />}
					{isLoading && <LoadingSpinner asOverlay />}
					<div className={classes.card} key={cardData?._id}>
						<div className={classes.list} key={cardData?._id}>
							{cardData?.status !== 'COMPLETED' ? (
								<div className={classes.cheklist}>
									<IconController
										type='MANUALREG'
										color='black'
										action={() => {
											console.log(cardData);
										}}
									/>
								</div>
							) : (
								''
							)}
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
								<React.Fragment>
									{evalActualTime()}
									<Controlls
										status={cardStatus}
										setCardStatus={setCardStatus}
										log={cardData}
										statusToControl={cardStatus}
									/>
								</React.Fragment>
							) : (
								<p>Impiegato: {convertToHour(cardStatus.minWorked)}</p>
							)}
						</div>
					</div>
				</React.Fragment>
			);
	}
}

export default Card;
