import React, { useState, useEffect } from 'react';

import { VALIDATOR_REQUIRE, VALIDATOR_NO } from '../../../utils/validators';
import { useForm } from '../../../hooks/form-hook';
import { useHttpClient } from '../../../hooks/http-hooks';

import Find from '../../../utils/finder/Find';

import Input from '../../../utils/Input';
import Button from '../../../utils/Button';
import ErrorModal from '../../../utils/ErrorModal';
import LoadingSpinner from '../../../utils/LoadingSpinner';

import classes from './NewActivity.module.css';

function NewActivity({ clear, day, setReload }) {
	const [contactId, setContactId] = useState(null);
	const [projectId, setProjectId] = useState(null);
	const [projectTitle, setProjectTitle] = useState(null);
	const [workDate, setWorkDate] = useState(new Date());

	const [formState, inputHandler, setFormData] = useForm({
		contactId: { value: contactId, isValid: true },
		projectId: { value: projectId, isValid: true },
		workDescription: { value: '', isValid: false },
		workType: { value: '', isValid: false },
	});

	const { isLoading, error, sendRequest, clearError } = useHttpClient();
	if (!day) {
		clear();
	}
	const today = day;

	let _minutes = ('0' + Math.round(workDate.getMinutes() / 15) * 15).slice(-2);
	let _hours = workDate.getHours();
	if (_minutes === '60') {
		_minutes = '00';
		_hours += 1;
	}

	const postActivity = async e => {
		e.preventDefault();
		const date = formState.inputs.dueDate.value;
		const hh = formState.inputs.hours.value;
		const mm = formState.inputs.quarters.value;
		let dueDate = new Date(date + ' ' + hh + ':' + mm);
		const el = await sendRequest(
			'api/log/newLog',
			'POST',
			{
				contactId: contactId,
				projectId: projectId,
				dueDate: dueDate,
				hours: formState.inputs.hours.value || '',
				quarters: formState.inputs.quarters.value || '',
				title: projectTitle,
				workDescription: formState.inputs.workDescription.value,
				workType: formState.inputs.workType.value || '',
				status: 'TODO',
			},
			{
				'Content-Type': 'application/json',
			}
		);
		console.log('Postato');
		// console.log(el);
		clear();
		// setDone(true);
	};

	useEffect(() => {
		return () => {
			setReload(true);
		};
	}, []);

	return (
		<React.Fragment>
			{error && <ErrorModal error={error} onClear={clearError} />}
			{isLoading && <LoadingSpinner asOverlay />}
			<div className={classes.container}>
				<form className={classes.form}>
					<Find
						url='api/contacts/findContactsList'
						setRes={setContactId}
						label='Contatto'
						inputId='contact'
						driver={'name'}
					/>
					{contactId && (
						<React.Fragment>
							<Find
								url={`api/project/getProjectsList/${contactId}`}
								setRes={setProjectId}
								setSecondaryRes={setProjectTitle}
								secondaryData='title'
								label='Progetto'
								inputId='project'
								driver={'title'}
								trigger={contactId}
							/>
							<div className={classes.inputs}>
								{projectId && (
									<React.Fragment>
										<Input
											id='dueDate'
											element='input'
											type='date'
											label='Data'
											validators={[VALIDATOR_REQUIRE()]}
											onInput={inputHandler}
											initValue={
												today?.getFullYear() +
												'-' +
												('0' + (today?.getMonth() + 1)).slice(-2) +
												'-' +
												('0' + today?.getDate()).slice(-2)
											}
											initIsValid={true}
										/>
										<div className={classes.dropdownTime}>
											<Input
												id='hours'
												element='dropdown'
												type='dropdown'
												baseList='hours'
												elementType='selectTime'
												label='Ora'
												validators={[VALIDATOR_REQUIRE()]}
												onInput={inputHandler}
												// initValue={('0' + workDate.getHours()).slice(-2)}
												initValue={_hours}
												initIsValid={true}
											/>
											<Input
												id='quarters'
												element='dropdown'
												type='dropdown'
												baseList='quarters'
												elementType='selectTime'
												label='Minuti'
												validators={[VALIDATOR_REQUIRE()]}
												onInput={inputHandler}
												// initValue={(
												// 	'0' +
												// 	Math.round(workDate?.getMinutes() / 15) * 15
												// ).slice(-2)}
												initValue={_minutes}
												initIsValid={true}
											/>
										</div>
										<Input
											id='workType'
											element='dropdown'
											type='dropdown'
											baseList='workType'
											label='Tipo attivit??'
											validators={[VALIDATOR_REQUIRE()]}
											errorText='Campo obbligatorio'
											onInput={inputHandler}
											initValue=''
											initIsValid={false}
										/>
										<Input
											id='workDescription'
											element='textarea'
											type='textarea'
											label='Descrizione attivit??'
											validators={[VALIDATOR_NO()]}
											onInput={inputHandler}
											initValue=''
											initIsValid={false}
										/>
									</React.Fragment>
								)}
							</div>
						</React.Fragment>
					)}
					<Button
						clname={'default big _50'}
						type='submit'
						disabled={!formState.isValid}
						onClick={postActivity}
					>
						Crea
					</Button>
					<Button clname={'danger big'} type='submit' onClick={clear}>
						Chiudi
					</Button>
				</form>
			</div>
		</React.Fragment>
	);
}

export default NewActivity;
