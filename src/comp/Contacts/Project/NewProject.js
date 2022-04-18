import React, { useState, useEffect } from 'react';

import { VALIDATOR_REQUIRE } from '../../../utils/validators';
import { useForm } from '../../../hooks/form-hook';
import { useHttpClient } from '../../../hooks/http-hooks';

import Input from '../../../utils/Input';
import Button from '../../../utils/Button';
import ErrorModal from '../../../utils/ErrorModal';
import LoadingSpinner from '../../../utils/LoadingSpinner';

import classes from './NewProject.module.css';
import { logDOM } from '@testing-library/react';

function NewProject({ contactId, clear, reload }) {
	// const [newData, setNewData] = useState(null);

	const [formState, inputHandler, setFormData] = useForm({
		contactId: { value: '', isValid: true },
		title: { value: '', isValid: false },
		description: { value: '', isValid: false },
		workType: { value: '', isValid: false },
		status: { value: '', isValid: true },
		active: { value: '', isValid: true },
		creationDate: { value: '', isValid: true },
	});

	const { isLoading, error, sendRequest, clearError } = useHttpClient();

	const postNewProject = async e => {
		e.preventDefault();
		const data = await sendRequest(
			'api/project/newProject',
			'POST',
			{
				title: formState.inputs.title.value,
				description: formState.inputs.description.value,
				workType: formState.inputs.workType.value,
				contactId: contactId,
				status: 'TODO',
				active: false,
				creationDate: new Date(),
			},
			{
				'Content-Type': 'application/json',
			}
		);
		clear(true);
	};

	return (
		<React.Fragment>
			{error && <ErrorModal error={error} onClear={clearError} />}
			{isLoading && <LoadingSpinner asOverlay />}
			<div className={classes.container}>
				<form className={classes.form}>
					<div className={classes.inputs}>
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
							id='description'
							element='textarea'
							type='textarea'
							label='Descrizione progetto'
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
							validators={[VALIDATOR_REQUIRE()]}
							errorText='Campo obbligatorio'
							onInput={inputHandler}
							initValue=''
							initIsValid={false}
						/>
					</div>
					<Button
						clname={'default big _50'}
						type='submit'
						disabled={!formState.isValid}
						onClick={postNewProject}
					>
						Crea
					</Button>
					<Button clname={'danger big'} type='submit' onClick={clear}>
						Chiudi
					</Button>
				</form>
			</div>
			;
		</React.Fragment>
	);
}

export default NewProject;
