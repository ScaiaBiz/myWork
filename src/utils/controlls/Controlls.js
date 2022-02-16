import React from 'react';

import { useHttpClient } from './../../hooks/http-hooks';
import LoadingSpinner from '../../utils/LoadingSpinner';
import ErrorModal from '../../utils/ErrorModal';

import classes from './Controlls.module.css';

function Controlls({ log, setCardStatus }) {
	const { isLoading, error, sendRequest, clearError } = useHttpClient();

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
		const stopped = await sendRequest(
			'api/log/stop',
			'POST',
			{
				logId: log._id,
				// summary: formState.inputs.summary.value,
			},
			{
				'Content-Type': 'application/json',
			}
		);
		log.status = stopped.status.status;
		setCardStatus(stopped.status);
		// setCardStatus(log.status);
	};

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
			onClick={postStop}
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
			<div className={classes.controls}>
				{active ? pause : play} {stop}
			</div>
		</React.Fragment>
	);
}

export default Controlls;
