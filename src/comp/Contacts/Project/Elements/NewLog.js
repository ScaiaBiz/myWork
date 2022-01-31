import React from 'react';

import { VALIDATOR_REQUIRE, VALIDATOR_NO } from '../../../../utils/validators';
import { useForm } from '../../../../hooks/form-hook';
import { useHttpClient } from '../../../../hooks/http-hooks';

import Input from '../../../../utils/Input';
import Button from '../../../../utils/Button';
import ErrorModal from '../../../../utils/ErrorModal';
import LoadingSpinner from '../../../../utils/LoadingSpinner';

import classes from './NewLog.module.css';

function NewLog({ clear, succes }) {
	const [formState, inputHandler, setFormData] = useForm({
		title: { value: '', isValid: false },
		dueDate: { value: '', isValid: false },
		workDescription: { value: '', isValid: false },
		workType: { value: '', isValid: true },
		status: { value: '', isValid: false },
	});

	const { isLoading, error, sendRequest, clearError } = useHttpClient();

	const postActivity = async e => {
		let today = new Date();
		e.preventDefault();
		console.log('Posto nuova attiità');
		await sendRequest(
			'api/logs/newLog',
			'POST',
			{
				dueDate: formState.inputs.dueDate.value || today,
				title: formState.inputs.title.value,
				workDescription: formState.inputs.workDescription.value,
				workType: formState.inputs.workType.value || '',
				status: formState.inputs.status.value || '',
			},
			{
				'Content-Type': 'application/json',
			}
		);
		console.log('Postato');
		succes(true);
		clear();
	};

	const showForm = () => {
		console.log('mostro form');
		return (
			<div className={classes.container}>
				<form className={classes.form}>
					<Input
						id='dueDate'
						element='input'
						type='date'
						label='Data esecuzione'
						validators={[VALIDATOR_NO()]}
						onInput={inputHandler}
						initValue=''
						initIsValid={true}
					/>
					<Input
						id='title'
						element='input'
						type='text'
						label='Titolo'
						validators={[VALIDATOR_REQUIRE()]}
						errorText='Campo obbligatorio'
						onInput={inputHandler}
						initValue=''
						initIsValid={false}
					/>
					<Input
						id='workType'
						element='dropdown'
						type='dropdown'
						baseList='workType'
						label='Tipo attività'
						validators={[VALIDATOR_NO()]}
						onInput={inputHandler}
						initValue=''
						initIsValid={true}
					/>
					<Input
						id='status'
						element='dropdown'
						type='dropdown'
						baseList='status'
						label='Status'
						validators={[VALIDATOR_NO()]}
						onInput={inputHandler}
						initValue=''
						initIsValid={true}
					/>
					<Input
						id='workDescription'
						element='textarea'
						type='textarea'
						label='Descrizione attività'
						validators={[VALIDATOR_NO()]}
						onInput={inputHandler}
						initValue=''
						initIsValid={true}
					/>
					<Button
						clname={'default big'}
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
