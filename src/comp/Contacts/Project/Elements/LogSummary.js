import React from 'react';

import { VALIDATOR_REQUIRE } from '../../../../utils/validators';
import { useForm } from '../../../../hooks/form-hook';

import Input from '../../../../utils/Input';
import Button from '../../../../utils/Button';

import classes from './LogSummary.module.css';

function LogSummary({ setData, clear }) {
	const [formState, inputHandler] = useForm({
		summary: { value: '', isValid: false },
	});

	const handleConfirm = e => {
		e.preventDefault();
		setData(formState.inputs.summary.value);
		console.log(formState.inputs.summary.value);
		clear();
	};
	return (
		<div className={classes.container}>
			<form className={classes.form}>
				<Input
					id='summary'
					element='textarea'
					type='text'
					label='Attività svolta'
					validators={[VALIDATOR_REQUIRE()]}
					onInput={inputHandler}
					initValue=''
					initIsValid={false}
				/>
				<Button
					clname={'default big _50'}
					type='submit'
					disabled={!formState.isValid}
					onClick={handleConfirm}
				>
					Salva
				</Button>
			</form>
		</div>
	);
}

export default LogSummary;
