import React from 'react';

import { VALIDATOR_REQUIRE, VALIDATOR_NO } from '../../../utils/validators';
import { useForm } from '../../../hooks/form-hook';
import { useHttpClient } from '../../../hooks/http-hooks';

import Input from '../../../utils/Input';
import Button from '../../../utils/Button';
import ErrorModal from '../../../utils/ErrorModal';
import LoadingSpinner from '../../../utils/LoadingSpinner';

import classes from './NewContact.module.css';

function NewContact({ clear, succes }) {
	const [formState, inputHandler, setFormData] = useForm({
		name: { value: '', isValid: false },
		street: { value: '' },
		number: { value: '', isValid: true },
		city: { value: '', isValid: true },
		postCode: { value: '', isValid: true },
		nation: { value: '', isValid: true },
	});

	const { isLoading, error, sendRequest, clearError } = useHttpClient();

	const postClient = async e => {
		e.preventDefault();
		console.log('Posto nuovo contatto');
		await sendRequest(
			'api/contacts/createContact',
			'POST',
			{
				name: formState.inputs.name.value,
				street: formState.inputs.street.value || '',
				number: formState.inputs.number.value || '',
				city: formState.inputs.city.value || '',
				postCode: formState.inputs.postCode.value || '',
				nation: formState.inputs.nation.value || '',
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
						id='name'
						element='input'
						type='text'
						label='Nome'
						validators={[VALIDATOR_REQUIRE()]}
						errorText='Campo obbligatorio'
						onInput={inputHandler}
						initValue=''
						initIsValid={false}
					/>
					<Input
						id='street'
						element='input'
						type='text'
						label='Indirizzo'
						validators={[VALIDATOR_NO()]}
						onInput={inputHandler}
						initValue=''
						initIsValid={true}
					/>
					<Input
						id='number'
						element='input'
						type='text'
						label='Numero civico'
						validators={[VALIDATOR_NO()]}
						onInput={inputHandler}
						initValue=''
						initIsValid={true}
					/>
					<Input
						id='city'
						element='input'
						type='text'
						label='Città'
						validators={[VALIDATOR_NO()]}
						onInput={inputHandler}
						initValue=''
						initIsValid={true}
					/>
					<Input
						id='postCode'
						element='input'
						type='text'
						label='Cap'
						validators={[VALIDATOR_NO()]}
						onInput={inputHandler}
						initValue=''
						initIsValid={true}
					/>
					<Input
						id='nation'
						element='input'
						type='text'
						label='Nazione'
						validators={[VALIDATOR_NO()]}
						onInput={inputHandler}
						initValue=''
						initIsValid={true}
					/>
					<Button
						clname={'default big'}
						type='submit'
						disabled={!formState.isValid}
						onClick={postClient}
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

export default NewContact;
