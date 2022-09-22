import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useHttpClient } from './../../../../hooks/http-hooks';
import LoadingSpinner from '../../../../utils/LoadingSpinner';
import ErrorModal from '../../../../utils/ErrorModal';

// import C_Card from './C_Card';

import {
	DDMMYYFromDateString,
	HourMinFromDateString,
} from '../../../../functions/MainFunctions';

import Find from '../../../../utils/finder/Find';

import classes from './C_Logs.module.css';

function C_Logs() {
	const param = useParams();
	const [activity, setActivity] = useState(null);
	const [projectId, setProjectId] = useState(null);

	const { isLoading, error, sendRequest, clearError } = useHttpClient();

	const getCard = async () => {
		const l = await sendRequest(`api/log/customerLogs/${param.contactId}`);
		const ac = l.logs.map(a => {
			// return <C_Card type='logs' key={a._id} cardData={a} />;

			if (a.status !== 'TODO') {
				return (
					<div className={classes.dataRow} key={a._id} cardData={a}>
						<p className={`${classes.dataCell}`}>
							{a.title}
							<p className={`${classes.typeDate}`}>
								{DDMMYYFromDateString(a.startWork || a.dueDate)}
								{' - '}
								{HourMinFromDateString(a.startWork || a.dueDate)}
							</p>
							<p className={`${classes.dataCell} ${classes.typeStatus}`}>
								{a.status}
							</p>
						</p>
						<p className={`${classes.dataCell} ${classes.typeDescription}`}>
							<p className={`${classes.dataCell} ${classes.typeWorkDesc}`}>
								{`${a.workDescription.toString()}`}
							</p>
							{a.workSummary}
						</p>
						<p className={`${classes.dataCell}`}>
							<p>Dedicato: {a.minWorked}</p>
							<p
								className={`${classes.typeStatus} ${
									classes[a.minToInvoice === 0 ? 'active' : 'inactive']
								}`}
							>
								{Number(a.minToInvoice) === 0 ? 'Da fatturare' : 'Fatturarto'}
							</p>
						</p>
					</div>
				);
			}
			return;
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

			<div className={classes.filters}>
				<Find
					url={`api/project/getProjects/${param.contactId}`}
					setRes={setProjectId}
					label='Progetto'
					inputId='projects'
					driver={'title'}
					resName='projects'
				/>
				<br />
				Filtro DA FATTURARE - Filtro DATA INIZIO - Filtro DATA FINE
			</div>
			<div className={classes.container}>{activity}</div>
		</React.Fragment>
	);
}

export default C_Logs;
