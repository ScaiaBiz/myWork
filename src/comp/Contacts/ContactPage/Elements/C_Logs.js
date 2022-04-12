import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useHttpClient } from './../../../../hooks/http-hooks';
import LoadingSpinner from '../../../../utils/LoadingSpinner';
import ErrorModal from '../../../../utils/ErrorModal';

import C_Card from './C_Card';

import classes from './C_Logs.module.css';

function C_Logs() {
	const param = useParams();
	const [activity, setActivity] = useState(null);

	const { isLoading, error, sendRequest, clearError } = useHttpClient();

	const getCard = async () => {
		const l = await sendRequest(`api/log/customerLogs/${param.contactId}`);
		const ac = l.logs.map(a => {
			return <C_Card type='logs' key={a._id} cardData={a} />;
		});
		setActivity(ac);
	};

	useEffect(() => {
		getCard();
	}, []);

	return (
		<React.Fragment>
			{error && <ErrorModal error={error} onClear={clearError} />}
			{isLoading && <LoadingSpinner asOverlay />}
			<div className={classes.container}>{activity}</div>
		</React.Fragment>
	);
}

export default C_Logs;
