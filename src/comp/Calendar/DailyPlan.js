import React, { useState, useEffect } from 'react';

import { useHttpClient } from '../../hooks/http-hooks';
import LoadingSpinner from '../../utils/LoadingSpinner';
import ErrorModal from '../../utils/ErrorModal';

import Card from '../Contacts/C_Utils/Card';
import Controlls from '../../utils/controlls/Controlls';

import classes from './DailyPlan.module.css';

function DailyPlan({ day }) {
	const { isLoading, error, sendRequest, clearError } = useHttpClient();

	const [plan, setPlan] = useState(null);

	const formatTime = time => {
		return new Date(time).toLocaleString('it-IT', {
			hour: '2-digit',
			minute: '2-digit',
		});
	};

	const convertToHour = minutes => {
		const timeFormat = n => ('00' + n).slice(-2);
		let min = minutes;
		let hour = Math.floor(min / 60);
		min = min - hour * 60;
		return timeFormat(hour) + ':' + timeFormat(min);
	};

	const getDailyPlan = async () => {
		const dailyPlan_data = await sendRequest(
			'api/log/getDailyPlan/' + day.getTime()
		);
		const data = dailyPlan_data.logs.map(l => {
			return <Card cardData={l} type={'CALENDAR'} />;
		});
		setPlan(data);
	};

	useEffect(() => {
		getDailyPlan();
	}, [day]);

	return (
		<React.Fragment>
			{error && <ErrorModal error={error} onClear={clearError} />}
			{isLoading && <LoadingSpinner asOverlay />}

			<div>{plan}</div>
		</React.Fragment>
	);
}

export default DailyPlan;
