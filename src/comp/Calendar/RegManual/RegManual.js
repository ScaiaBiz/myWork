import React, { useState, useEffect } from 'react';

import { VALIDATOR_REQUIRE, VALIDATOR_NO } from '../../../utils/validators';
import { useForm } from '../../../hooks/form-hook';
import { useHttpClient } from '../../../hooks/http-hooks';

import Find from '../../../utils/finder/Find';

import Input from '../../../utils/Input';
import Button from '../../../utils/Button';
import ErrorModal from '../../../utils/ErrorModal';
import LoadingSpinner from '../../../utils/LoadingSpinner';

import classes from './RegManual.module.css';

function RegManual({ clear, day, cardStatus, setCardStatus, setReload }) {
	const [workDate, setWorkDate] = useState(new Date(day));
	const [lStartWork, setLStartWork] = useState(null);
	const [lEndWork, setLEndWork] = useState(null);

	useEffect(() => {
		console.log(cardStatus);
		if (cardStatus?.startWork) {
			setLStartWork(new Date(cardStatus?.startWork));
		} else {
			setLStartWork(new Date(cardStatus?.dueDate));
		}
		if (cardStatus?.endWork) {
			setLEndWork(new Date(cardStatus?.endWork));
		} else {
			setLEndWork(new Date(cardStatus?.dueDate));
		}

		evalTimes();
		return () => {};
	}, []);

	const [formState, inputHandler, setFormData] = useForm({
		workSummary: { value: '', isValid: false },
		s_hours: { value: '', isValid: false },
		s_quarters: { value: '', isValid: false },
		e_hours: { value: '', isValid: false },
		e_quarters: { value: '', isValid: false },
	});

	const { isLoading, error, sendRequest, clearError } = useHttpClient();
	if (!day) {
		clear();
	}
	const today = new Date(day);

	let start_min;
	let start_h;
	let end_min;
	let end_h;

	const evalTimes = () => {
		if (lStartWork) {
			console.log({ lStartWork });
			start_min = lStartWork?.getMinutes();
			start_h = lStartWork?.getHours();
		} else {
			start_min = ('0' + Math.round(workDate?.getMinutes() / 15) * 15).slice(
				-2
			);
			start_h = workDate?.getHours();
			if (start_min === '60') {
				start_min = '00';
				start_h += 1;
			}
		}

		if (lEndWork) {
			console.log({ lEndWork });
			end_min = lEndWork?.getMinutes();
			end_h = lEndWork?.getHours();
		} else {
			end_min = ('0' + Math.round(workDate.getMinutes() / 15) * 15).slice(-2);
			end_h = workDate.getHours();
			if (cardStatus.status === 'TODO') {
				end_h += 1;
			}
			if (end_min === '60') {
				end_min = '00';
				end_h += 1;
			}
		}
	};

	const evalDateString = date => {
		const _d =
			date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
		return _d;
	};

	const postActivity = async e => {
		e.preventDefault();
		console.log('Tento post');

		const s_date = evalDateString(lStartWork);
		const s_hh = formState.inputs.s_hours.value;
		const s_mm = formState.inputs.s_quarters.value;
		let t_startWork = new Date(s_date + ' ' + s_hh + ':' + s_mm);

		const e_date = evalDateString(lEndWork);
		const e_hh = formState.inputs.e_hours.value;
		const e_mm = formState.inputs.e_quarters.value;
		let t_endWork = new Date(e_date + ' ' + e_hh + ':' + e_mm);

		console.log({ t_startWork });
		console.log({ t_endWork });

		console.log(formState.inputs);

		const el = await sendRequest(
			'api/log/regManual',
			'POST',
			{
				_id: cardStatus._id,
				startWork: t_startWork,
				endWork: t_endWork,
				workSummary: formState.inputs.workSummary.value,
			},
			{
				'Content-Type': 'application/json',
			}
		);
		console.log('Aggiornato');
		console.log(el);

		setCardStatus(el.newData);
		clear();
	};

	const clearCard = e => {
		e.preventDefault();
		clear();
	};

	useEffect(() => {
		console.log(cardStatus);
		return () => {
			setReload(true);
		};
	}, []);

	const convertToHour = value => {
		const timeFormat = n => ('00' + n).slice(-2);
		let min = value;
		let hour = Math.floor(min / 60);
		min = min - hour * 60;
		return timeFormat(hour) + ':' + timeFormat(min);
	};

	return (
		<React.Fragment>
			{error && <ErrorModal error={error} onClear={clearError} />}
			{isLoading && <LoadingSpinner asOverlay />}
			{evalTimes()}
			{/* {console.log({ start_h })}
			{console.log({ start_min })}
			{console.log({ end_h })}
			{console.log({ end_min })} */}
			<div className={classes.background} onClick={clear}></div>
			<div className={classes.container}>
				<form className={classes.form}>
					<div className={classes.inputs}>
						<div className={classes.timeBox}>
							Inizio:
							<div className={classes.dropdownTime}>
								<Input
									id='s_hours'
									element='dropdown'
									type='dropdown'
									baseList='hours'
									elementType='selectTime'
									label={`Ora: ${start_h}`}
									validators={[VALIDATOR_REQUIRE()]}
									onInput={inputHandler}
									initValue={start_h}
									initIsValid={true}
								/>
								<Input
									id='s_quarters'
									element='dropdown'
									type='dropdown'
									baseList='quarters'
									elementType='selectTime'
									label={`Minuti: ${start_min}`}
									validators={[VALIDATOR_REQUIRE()]}
									onInput={inputHandler}
									initValue={start_min}
									initIsValid={true}
								/>
							</div>
						</div>
						<div className={classes.timeBox}>
							Fine:
							<div className={classes.dropdownTime}>
								<Input
									id='e_hours'
									element='dropdown'
									type='dropdown'
									baseList='hours'
									elementType='selectTime'
									label={`Ora: ${end_h}`}
									validators={[VALIDATOR_REQUIRE()]}
									onInput={inputHandler}
									initValue={end_h}
									initIsValid={true}
								/>
								<Input
									id='e_quarters'
									element='dropdown'
									type='dropdown'
									baseList='quarters'
									elementType='selectTime'
									label={`Minuti: ${end_min}`}
									validators={[VALIDATOR_REQUIRE()]}
									onInput={inputHandler}
									initValue={end_min}
									initIsValid={true}
								/>
							</div>
						</div>
						{Number(cardStatus.breaksTime) > 0 && (
							<div>
								Sospensione:{' '}
								{convertToHour(Math.round(cardStatus.breaksTime / 60000))}
							</div>
						)}
						<div>Totale impiegato: {convertToHour(cardStatus.minWorked)}</div>
						<Input
							id='workSummary'
							element='textarea'
							type='textarea'
							label='Attività svolta'
							validators={[VALIDATOR_NO()]}
							onInput={inputHandler}
							initValue={cardStatus.workSummary}
							initIsValid={false}
						/>
					</div>
					<Button
						clname={'default big _50'}
						type='submit'
						disabled={!formState.isValid}
						onClick={postActivity}
					>
						Registra
					</Button>
					<Button clname={'danger big'} type='submit' onClick={clearCard}>
						Annulla
					</Button>
				</form>
			</div>
		</React.Fragment>
	);
}

export default RegManual;
