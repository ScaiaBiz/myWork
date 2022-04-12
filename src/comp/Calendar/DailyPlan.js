import React, { useState, useEffect } from 'react';

import { useHttpClient } from '../../hooks/http-hooks';
import LoadingSpinner from '../../utils/LoadingSpinner';
import ErrorModal from '../../utils/ErrorModal';

import classes from './DailyPlan.module.css';

function DailyPlan({ day }) {
	const { isLoading, error, sendRequest, clearError } = useHttpClient();

	const [plan, setPlan] = useState(null);

	const getDailyPlan = async () => {
		const dailyPlan_data = await sendRequest(
			'api/log/getDailyPlan/' + day.getTime()
		);
		const data = dailyPlan_data.logs.map(l => {
			return (
				<p>
					{l.title} - {l.workDescription}
				</p>
			);
		});
		setPlan(data);
	};

	useEffect(() => {
		console.log('Carico dati');
		getDailyPlan();
	}, []);

	return (
		<React.Fragment>
			{error && <ErrorModal error={error} onClear={clearError} />}
			{isLoading && <LoadingSpinner asOverlay />}
			<div>{plan}</div>
		</React.Fragment>
	);
}

export default DailyPlan;
