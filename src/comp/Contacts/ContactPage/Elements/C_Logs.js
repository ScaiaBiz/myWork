import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { VALIDATOR_REQUIRE, VALIDATOR_NO } from '../../../../utils/validators';
import { useForm } from '../../../../hooks/form-hook';
import { useHttpClient } from './../../../../hooks/http-hooks';
import Input from '../../../../utils/Input';
import LoadingSpinner from '../../../../utils/LoadingSpinner';
import ErrorModal from '../../../../utils/ErrorModal';

// import C_Card from './C_Card';

import {
	DDMMYYFromDateString,
	HourMinFromDateString,
	convertMinToHour,
} from '../../../../functions/MainFunctions';

import Find from '../../../../utils/finder/Find';

import classes from './C_Logs.module.css';

function C_Logs() {
	const param = useParams();
	const [activity, setActivity] = useState(null);
	const [projectId, setProjectId] = useState(null);

	const { isLoading, error, sendRequest, clearError } = useHttpClient();

	const [formState, inputHandler, setFormData] = useForm({
		// projectId: { value: '', isValid: true },
		toInvoice: { value: false, isValid: false },
		startWork: { value: '2020-01-01', isValid: true },
		endWork: { value: '2022-09-30', isValid: true },
	});

	const getCard = async () => {
		const l = await sendRequest(
			`api/log/customerLogs/${param.contactId}`,
			'POST',
			{
				projectId: projectId,
				toInvoice: formState.inputs.toInvoice.value,
				startWork: formState.inputs.startWork.value,
				endWork: formState.inputs.endWork.value,
			},
			{
				'Content-Type': 'application/json',
			}
		);
		const ac = l.logs.map(a => {
			// return <C_Card type='logs' key={a._id} cardData={a} />;

			if (a.status !== 'TODO') {
				return (
					<div className={classes.dataRow} key={a._id}>
						<p className={`${classes.dataCell}`}>
							<p className={classes.typeProject}>{a.title}</p>
							<p className={`${classes.typeDate}`}>
								{DDMMYYFromDateString(a.startWork || a.dueDate)}
								{' - '}
								{HourMinFromDateString(a.startWork || a.dueDate)}
							</p>
							<p className={classes.typeStatus}>{a.status}</p>
						</p>
						<p className={`${classes.dataCell} ${classes.typeDescription}`}>
							<p className={`${classes.dataCell} ${classes.typeWorkDesc}`}>
								{`${a.workDescription.toString()}`}
							</p>
							{a.workSummary}
						</p>
						<p className={`${classes.dataCell}`}>
							<p>Dedicato {convertMinToHour(a.minWorked)}</p>
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
					inputId='project'
					driver={'title'}
					resName='projects'
				/>
				<Input
					id='toInvoice'
					element='checkbox'
					type='checkbox'
					label='Da fatturare'
					onInput={inputHandler}
					validators={[VALIDATOR_NO()]}
					initValue={false}
					initIsValid={true}
				/>
				<Input
					id='startWork'
					element='input'
					type='date'
					label='Data Inizio'
					validators={[VALIDATOR_NO()]}
					onInput={inputHandler}
					initValue='2020-01-01'
					initIsValid={true}
				/>
				<Input
					id='endWork'
					element='input'
					type='date'
					label='Data Fine'
					validators={[VALIDATOR_NO()]}
					onInput={inputHandler}
					initValue='2022-09-30'
					initIsValid={true}
				/>
				<div onClick={getCard}>Button</div>
			</div>
			<div className={classes.container}>{activity}</div>
		</React.Fragment>
	);
}

export default C_Logs;
