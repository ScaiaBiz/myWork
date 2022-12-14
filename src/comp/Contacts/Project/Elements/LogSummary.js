import React from 'react';

import { VALIDATOR_REQUIRE } from '../../../../utils/validators';
import { useForm } from '../../../../hooks/form-hook';

import Input from '../../../../utils/Input';
import Button from '../../../../utils/Button';

import classes from './LogSummary.module.css';

function LogSummary({ setData, clear, data, button }) {
	const [formState, inputHandler] = useForm({
		summary: { value: data?.workSummary || '', isValid: false },
	});

	const desc = data?.workSummary;

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
					initValue={desc || ''}
					initIsValid={false}
				/>
				<Button
					clname={'default big _50'}
					type='submit'
					disabled={!formState.isValid}
					onClick={handleConfirm}
				>
					{button}
				</Button>
				<Button clname={'danger big'} type='submit' onClick={clear}>
					Chiudi
				</Button>
			</form>
		</div>
	);
}

export default LogSummary;
