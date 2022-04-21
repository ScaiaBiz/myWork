import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

import { useHttpClient } from './../../hooks/http-hooks';
import LoadingSpinner from '../../utils/LoadingSpinner';
import ErrorModal from '../../utils/ErrorModal';
import Backdrop from '../Backdrop';
import LogSummary from '../../comp/Contacts/Project/Elements/LogSummary';

import classes from './Controlls.module.css';

function Controlls({ log, setCardStatus }) {
	const { isLoading, error, sendRequest, clearError } = useHttpClient();

	const [summaryIsNeeded, setSummaryIsNeeded] = useState(false);
	const [summaryDescription, setSummaryDescription] = useState('');
	const [notaDescription, setNotaDescription] = useState('');
	const [nota, setNota] = useState(false);

	const summaryIsNeededHandler = () => {
		setSummaryIsNeeded(!summaryIsNeeded);
	};

	const notaHandler = () => {
		setNota(!nota);
	};

	const createSummary = () => {
		const formLogSummary = (
			<React.Fragment>
				<Backdrop
					onClick={nota ? notaHandler : summaryIsNeededHandler}
					level='secondo'
				/>
				<LogSummary
					setData={nota ? setNotaDescription : setSummaryDescription}
					clear={nota ? notaHandler : summaryIsNeededHandler}
					data={log}
					button={nota ? 'Aggiungi' : 'Salva'}
				/>
			</React.Fragment>
		);
		return ReactDOM.createPortal(
			formLogSummary,
			document.getElementById('modal-hook_2')
		);
	};

	const postPlay = async () => {
		let prova = await sendRequest(
			'api/log/pause',
			'POST',
			{
				logId: log._id,
			},
			{
				'Content-Type': 'application/json',
			}
		);

		if (log.status === 'ONGOING') {
			log.status = 'PAUSED';
		} else {
			log.status = 'ONGOING';
		}

		setCardStatus(log.status);
	};

	const postNote = async () => {
		console.log(notaDescription);
		let prova = await sendRequest(
			'api/log/nota',
			'POST',
			{
				logId: log._id,
				workSummary: notaDescription,
			},
			{
				'Content-Type': 'application/json',
			}
		);
		log.workSummary = notaDescription;
	};

	const postStop = async () => {
		console.log(summaryDescription);
		const stopped = await sendRequest(
			'api/log/stop',
			'POST',
			{
				logId: log._id,
				workSummary: summaryDescription,
			},
			{
				'Content-Type': 'application/json',
			}
		);
		log.status = stopped.status.status;
		setCardStatus(stopped.status);
	};

	useEffect(() => {
		if (summaryDescription !== '') {
			postStop();
		}
	}, [summaryDescription]);

	useEffect(() => {
		if (notaDescription !== '') {
			console.log('Cerco di postare la nota');
			postNote();
		}
	}, [notaDescription]);

	const play = (
		<i
			className={`material-icons ${classes.icons} ${classes.play}`}
			onClick={postPlay}
		>
			play_circle_outline
		</i>
	);

	const pause = (
		<i
			className={`material-icons ${classes.icons} ${classes.pause}`}
			onClick={postPlay}
		>
			pause_circle_outline
		</i>
	);

	const stop = (
		<i
			className={`material-icons ${classes.icons} ${classes.stop}`}
			onClick={summaryIsNeededHandler}
			// onClick={postStop} //Provvisorio
		>
			stop_circle
		</i>
	);

	const note = (
		<i
			class={`material-icons ${classes.icons} ${classes.edit}`}
			onClick={notaHandler}
		>
			edit_note
		</i>
	);

	let active = false;
	if (log.status === 'ONGOING') {
		active = true;
	}

	let stoppable = false;
	if (log.status !== 'TODO') {
		stoppable = true;
	}

	return (
		<React.Fragment>
			{error && <ErrorModal error={error} onClear={clearError} />}
			{isLoading && <LoadingSpinner asOverlay />}
			{summaryIsNeeded && createSummary()}
			{nota && createSummary()}
			<div className={classes.controls}>
				{active ? pause : play}
				{note}
				{stoppable && stop}
			</div>
		</React.Fragment>
	);
}

export default Controlls;
