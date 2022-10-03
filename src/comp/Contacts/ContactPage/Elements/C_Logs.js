import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { VALIDATOR_REQUIRE, VALIDATOR_NO } from '../../../../utils/validators';
import { useForm } from '../../../../hooks/form-hook';
import { useHttpClient } from './../../../../hooks/http-hooks';
import Input from '../../../../utils/Input';
import LoadingSpinner from '../../../../utils/LoadingSpinner';
import ErrorModal from '../../../../utils/ErrorModal';
import Button from '../../../../utils/Button';

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
	const [filtersHide, setFiltersHide] = useState(true);
	const handleHideFilters = () => {
		setFiltersHide(!filtersHide);
		// document
		// 	.getElementById('my_filters')
		// 	.classList.toggle(classes.inputs__hidden);
	};

	const [totalWorked, settotalWorked] = useState(0);

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

		let workSum = 0;
		const ac = l.logs.map(a => {
			// return <C_Card type='logs' key={a._id} cardData={a} />;

			if (a.status !== 'TODO') {
				workSum += a.minWorked;
				return (
					<div className={classes.dataRow} key={a._id}>
						<p className={`${classes.dataCell}`}>
							<p className={classes.typeProject}>{a.title}</p>
							<p className={`${classes.typeDate}`}>
								{DDMMYYFromDateString(a.startWork || a.dueDate)}
								{' dalle '}
								{HourMinFromDateString(a.startWork || a.dueDate)}
							</p>
							{/* <p className={classes.typeStatus}>{a.status}</p> */}
						</p>
						<p className={`${classes.dataCell} ${classes.typeDescription}`}>
							<p className={`${classes.dataCell} ${classes.typeWorkDesc}`}>
								{`${a.workDescription.toString()}`}
							</p>
							{a.workSummary}
						</p>
						<p className={`${classes.dataCell} ${classes.typeSummary}`}>
							<p>Dedicato {convertMinToHour(a.minWorked)}</p>
							<p
								className={`${classes.typeStatus} ${
									classes[a.minToInvoice === 0 ? 'active' : 'inactive']
								}`}
							>
								{Number(a.minToInvoice) === 0 ? 'Da fatturare' : 'Fatturarto'}
							</p>
							{/* <p>Progressivo {convertMinToHour(workSum)}</p> */}
						</p>
					</div>
				);
			}
			return;
		});
		settotalWorked(workSum);
		setActivity(ac);
	};

	useEffect(() => {
		getCard();
	}, []);

	useEffect(() => {
		if (!filtersHide) {
			handleHideFilters();
		}
	}, [activity]);

	const checkedHandler = () => {
		let _val = document.getElementById('toInvoice').checked;
		inputHandler('toInvoice', _val, true);
	};

	return (
		<React.Fragment>
			{error && <ErrorModal error={error} onClear={clearError} />}
			{isLoading && <LoadingSpinner asOverlay />}

			<div
				id='my_filters'
				className={`${classes.filters}
			${
				''
				// !filtersHide && classes.fadeIn
			}
			`}
			>
				<div
					className={`${classes.filters__inputs} ${
						filtersHide && classes.inputs__hidden
					}`}
				>
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
						label='Fatturato'
						onClick={checkedHandler}
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

					{/* <div className={classes.filterButton} onClick={getCard}>
					Filtra
				</div> */}
					<Button
						clname={'default _50'}
						onClick={() => {
							getCard();
							handleHideFilters();
						}}
					>
						Filtra
					</Button>
				</div>
				<div className={classes.filtersHandler} onClick={handleHideFilters}>
					{filtersHide ? 'Mostra filtri' : 'Chiudi'}
				</div>
			</div>
			<h2 style={{ paddingBottom: '2%' }}>
				Totale {convertMinToHour(totalWorked)}
			</h2>
			<div className={classes.container}>{activity}</div>
		</React.Fragment>
	);
}

export default C_Logs;
