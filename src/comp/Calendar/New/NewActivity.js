import React, { useState } from 'react';

import { VALIDATOR_REQUIRE, VALIDATOR_NO } from '../../../utils/validators';
import { useForm } from '../../../hooks/form-hook';
import { useHttpClient } from '../../../hooks/http-hooks';

import Input from '../../../utils/Input';
import Button from '../../../utils/Button';
import ErrorModal from '../../../utils/ErrorModal';
import LoadingSpinner from '../../../utils/LoadingSpinner';

import classes from './NewActivity.module.css';

function NewActivity({ clear, day }) {
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

	const [contactId, setContactId] = useState(null);
	const [projectId, setprojectId] = useState(null);

	const today = day;

	return (
		<React.Fragment>
			{error && <ErrorModal error={error} onClear={clearError} />}
			{isLoading && <LoadingSpinner asOverlay />}
			<div className={classes.container}>
				<form className={classes.form}>
					<Input
						id='workType'
						element='dropdown'
						type='dropdown'
						baseList='workType'
						label='Contatto'
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
						label='Progetto'
						validators={[VALIDATOR_REQUIRE()]}
						errorText='Campo obbligatorio'
						onInput={inputHandler}
						initValue=''
						initIsValid={false}
					/>

					<div className={classes.inputs}>
						<Input
							id='dueDate'
							element='input'
							type='date'
							label='Data'
							validators={[VALIDATOR_REQUIRE()]}
							onInput={inputHandler}
							initValue={
								today.getFullYear() +
								'-' +
								('0' + (today.getMonth() + 1)).slice(-2) +
								'-' +
								today.getDate()
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
								initValue={'08'}
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
								initValue={(
									'0' +
									Math.round(today.getMinutes() / 15) * 15
								).slice(-2)}
								initIsValid={true}
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
					</div>
					<Button
						clname={'default big _50'}
						type='submit'
						disabled={!formState.isValid}
						// onClick={postNewProject}
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
