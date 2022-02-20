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

	const summaryIsNeededHandler = () => {
		setSummaryIsNeeded(!summaryIsNeeded);
	};

	useEffect(() => {
		console.log(summaryIsNeeded);
	}, [summaryIsNeeded]);

	const createSummary = () => {
		const formLogSummary = (
			<React.Fragment>
				<Backdrop onClick={summaryIsNeededHandler} level='secondo' />
				<LogSummary
					setData={setSummaryDescription}
					clear={summaryIsNeededHandler}
				/>
			</React.Fragment>
		);
		return ReactDOM.createPortal(
			formLogSummary,
			document.getElementById('modal-hook_2')
		);
	};

	const postPlay = () => {
		sendRequest(
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
		// return () => {
		// 	console.log(summaryDescription);
		// };
	}, [summaryDescription]);

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

	let active = false;
	if (log.status === 'ONGOING') {
		active = true;
	}

	return (
		<React.Fragment>
			{error && <ErrorModal error={error} onClear={clearError} />}
			{isLoading && <LoadingSpinner asOverlay />}
			{summaryIsNeeded && createSummary()}
			<div className={classes.controls}>
				{active ? pause : play} {stop}
			</div>
		</React.Fragment>
	);
}

export default Controlls;
