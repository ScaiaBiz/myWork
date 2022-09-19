import React, { useState, useEffect } from 'react';

import { VALIDATOR_REQUIRE, VALIDATOR_NO } from '../../../utils/validators';
import { useForm } from '../../../hooks/form-hook';
import { useHttpClient } from '../../../hooks/http-hooks';

import {
	convertMinToHour,
	convertTimeStringToMilliseconds,
} from '../../../functions/MainFunctions';

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
	const [updateTimes, setUpdateTimes] = useState(false);
	const [formTimes, setFormTimes] = useState(null);

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
			console.error('Non trovo endWork!');
			setLEndWork(new Date(cardStatus?.dueDate));
		}
		setUpdateTimes(!updateTimes);
		return () => {};
	}, []);

	useEffect(() => {
		evalTimes();
	}, [updateTimes]);

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

	const evalTimes = () => {
		let start_min;
		let start_h;
		let end_min;
		let end_h;
		let pause_min;
		let pause_h;

		// console.log({ lStartWork });
		if (lStartWork) {
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

		// console.log({ lEndWork });
		if (lEndWork) {
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

		if (cardStatus.breaksTime) {
			let p_string = convertMinToHour(
				Math.round(cardStatus.breaksTime / 60000)
			);

			pause_h = p_string.split(':')[0];
			pause_min = p_string.split(':')[1];
		}

		// console.log({ start_h });
		// console.log({ start_min });
		// console.log({ end_h });
		// console.log({ end_min });

		setFormTimes({
			start_h: start_h,
			start_min: start_min,
			end_h: end_h,
			end_min: end_min,
			pause_h: pause_h,
			pause_min: pause_min,
		});
	};

	useEffect(() => {
		console.log('Prima');
		if (formTimes) {
			console.log('True');
			document.getElementById('s_hours').value = formTimes?.start_h;
			document.getElementById('s_quarters').value = formTimes?.start_min;
			document.getElementById('e_hours').value = formTimes?.end_h;
			document.getElementById('e_quarters').value = formTimes?.end_min;
			if (formTimes?.pause_h || formTimes.pause_min) {
				document.getElementById('p_hours').value = formTimes?.pause_h;

				document.getElementById('p_quarters').value = formTimes?.pause_min;
			}
		}
	}, [formTimes]);

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

		const p_mls = convertTimeStringToMilliseconds(
			formState.inputs.p_hours.value,
			formState.inputs.p_quarters.value
		);

		console.log(p_mls);

		// console.log(formState.inputs);

		const el = await sendRequest(
			'api/log/regManual',
			'POST',
			{
				_id: cardStatus._id,
				startWork: t_startWork,
				endWork: t_endWork,
				workSummary: formState.inputs.workSummary.value,
				breaksTime: p_mls,
			},
			{
				'Content-Type': 'application/json',
			}
		);

		setCardStatus(el.newData);
		clear();
	};

	const clearCard = e => {
		e.preventDefault();
		clear();
	};

	return (
		<React.Fragment>
			{error && <ErrorModal error={error} onClear={clearError} />}
			{isLoading && <LoadingSpinner asOverlay />}
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
									label={`Ore: ${formTimes?.start_h}`}
									validators={[VALIDATOR_REQUIRE()]}
									onInput={inputHandler}
									initValue={''}
									initIsValid={true}
								/>
								<Input
									id='s_quarters'
									element='dropdown'
									type='dropdown'
									baseList='quarters'
									elementType='selectTime'
									label={`Min: ${formTimes?.start_min}`}
									validators={[VALIDATOR_REQUIRE()]}
									onInput={inputHandler}
									initValue={''}
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
									label={`Ore: ${formTimes?.end_h}`}
									validators={[VALIDATOR_REQUIRE()]}
									onInput={inputHandler}
									initValue={''}
									initIsValid={true}
								/>
								<Input
									id='e_quarters'
									element='dropdown'
									type='dropdown'
									baseList='quarters'
									elementType='selectTime'
									label={`Min: ${formTimes?.end_min}`}
									validators={[VALIDATOR_REQUIRE()]}
									onInput={inputHandler}
									initValue={''}
									initIsValid={true}
								/>
							</div>
						</div>
						{Number(cardStatus.breaksTime) > 0 && (
							<div>
								Sospensione:
								<div className={classes.dropdownTime}>
									<Input
										id='p_hours'
										element='dropdown'
										type='dropdown'
										baseList='hours'
										elementType='selectTime'
										label={`Ore: ${formTimes?.pause_h}`}
										validators={[VALIDATOR_REQUIRE()]}
										onInput={inputHandler}
										initValue={''}
										initIsValid={true}
									/>
									<Input
										id='p_quarters'
										element='dropdown'
										type='dropdown'
										baseList='quarters'
										elementType='selectTime'
										label={`Min: ${formTimes?.pause_min}`}
										validators={[VALIDATOR_REQUIRE()]}
										onInput={inputHandler}
										initValue={''}
										initIsValid={true}
									/>
								</div>
							</div>
						)}
						<div>
							Totale impiegato: {convertMinToHour(cardStatus.minWorked)}
						</div>
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
