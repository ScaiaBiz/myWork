import React, { useState, useEffect } from 'react';

import { VALIDATOR_REQUIRE, VALIDATOR_NO } from '../../../../utils/validators';
import { useForm } from '../../../../hooks/form-hook';
import { useHttpClient } from '../../../../hooks/http-hooks';

import Input from '../../../../utils/Input';
import Button from '../../../../utils/Button';
import ErrorModal from '../../../../utils/ErrorModal';
import LoadingSpinner from '../../../../utils/LoadingSpinner';

import classes from './NewLog.module.css';

function NewLog({ clear, succes, projectId, projectTitle, contactId }) {
	const [newData, setNewData] = useState(null);

	const [formState, inputHandler, setFormData] = useForm({
		// title: { value: { projectTitle }, isValid: true },
		dueDate: { value: '', isValid: false },
		hours: { value: '', isValid: false },
		quarters: { value: '', isValid: false },
		workDescription: { value: '', isValid: false },
		workType: { value: '', isValid: true },
		// status: { value: '', isValid: false },
	});

	const { isLoading, error, sendRequest, clearError } = useHttpClient();

	const postActivity = async e => {
		e.preventDefault();
		const date = formState.inputs.dueDate.value;
		const hh = formState.inputs.hours.value;
		const mm = formState.inputs.quarters.value;
		let dueDate = new Date(date + ' ' + hh + ':' + mm);
		setNewData(
			await sendRequest(
				'api/log/newLog',
				'POST',
				{
					contactId: contactId,
					projectId: projectId,
					dueDate: dueDate,
					hours: formState.inputs.hours.value || '',
					quarters: formState.inputs.quarters.value || '',
					// title: formState.inputs.title.value,
					title: projectTitle,
					workDescription: formState.inputs.workDescription.value,
					workType: formState.inputs.workType.value || '',
					status: 'TODO',
				},
				{
					'Content-Type': 'application/json',
				}
			)
		);
		console.log('Postato');
	};

	useEffect(() => {
		if (newData) {
			succes(true);
			clear();
		}
	}, [newData]);

	const showForm = () => {
		return (
			<div className={classes.container}>
				<form className={classes.form}>
					{/* <Input
						id='title'
						element='input'
						type='text'
						label='Titolo'
						validators={[VALIDATOR_REQUIRE()]}
						errorText='Campo obbligatorio'
						onInput={inputHandler}
						initValue={projectTitle}
						initIsValid={false}
					/> */}
					<Input
						id='dueDate'
						element='input'
						type='date'
						label='Data'
						validators={[VALIDATOR_REQUIRE()]}
						onInput={inputHandler}
						initValue=''
						initIsValid={false}
					/>
					{/* <Input
						id='time'
						element='input'
						type='time'
						label='Orario'
						step='900'
						validators={[VALIDATOR_NO()]}
						onInput={inputHandler}
						initValue=''
						initIsValid={true}
					/> */}
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
							initValue=''
							initIsValid={false}
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
							initValue=''
							initIsValid={false}
						/>
					</div>
					<Input
						id='workType'
						element='dropdown'
						type='dropdown'
						baseList='workType'
						label='Tipo attività'
						validators={[VALIDATOR_REQUIRE()]}
						errorText='Campo obbligatorio'
						onInput={inputHandler}
						initValue=''
						initIsValid={false}
					/>
					{/* <Input
						id='status'
						element='dropdown'
						type='dropdown'
						baseList='status'
						label='Status'
						validators={[VALIDATOR_REQUIRE()]}
						errorText='Campo obbligatorio'
						onInput={inputHandler}
						initValue=''
						initIsValid={false}
					/> */}
					<Input
						id='workDescription'
						element='textarea'
						type='textarea'
						label='Descrizione attività'
						validators={[VALIDATOR_NO()]}
						onInput={inputHandler}
						initValue=''
						initIsValid={false}
					/>
					<Button
						clname={'default big _50'}
						type='submit'
						disabled={!formState.isValid}
						onClick={postActivity}
					>
						Save
					</Button>
				</form>
			</div>
		);
	};

	return (
		<React.Fragment>
			{error && <ErrorModal error={error} onClear={clearError} />}
			{isLoading && <LoadingSpinner asOverlay />}
			<div>{showForm()}</div>
		</React.Fragment>
	);
}

export default NewLog;
