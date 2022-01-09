import React, { useEffect, useContext, useState } from 'react';

import { VALIDATOR_REQUIRE } from '../../utils/validators';
import { useForm } from '../../hooks/form-hook';
import { useHttpClient } from '../../hooks/http-hooks';
import { UserCxt } from '../../cxt/UserCxt';

import Input from '../../utils/Input';
import Button from '../../utils/Button';
import LoadingSpinner from '../../utils/LoadingSpinner';
import ErrorModal from '../../utils/ErrorModal';

import classes from './Login.module.css';

function Login() {
	const [formState, inputHandler, setFormData] = useForm(
		{
			name: {
				value: '',
				isValid: false,
			},
			password: {
				value: '',
				isValid: false,
			},
		},
		false
	);

	//extract local storage area
	const LS_Area = useContext(UserCxt).LS_Area;
	const [user, setUser] = useContext(UserCxt).user;
	const { isLoading, error, sendRequest, clearError } = useHttpClient();

	const [testLoading, setTestLoading] = useState(false);

	const postLogin = async e => {
		e.preventDefault();
		const responseData = await sendRequest(
			'login',
			'POST',
			{
				name: formState.inputs.name.value,
				password: formState.inputs.password.value,
			},
			{
				'Content-Type': 'application/json',
			}
		);
		setUser(responseData);
	};

	const postLogout = async e => {
		e.preventDefault();
		if (user) {
			const responseData = await sendRequest(
				'logout',
				'POST',
				{ isAdmin: user.isAdmin },
				{
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + user.token,
				}
			);
			console.log(responseData);
		}
		setUser(null);
		localStorage.setItem(LS_Area, null);
	};

	const postSignIn = async e => {
		e.preventDefault();

		// setTestLoading(true);
		// setTimeout(() => {
		// 	setTestLoading(false);
		// }, 1000);

		const responseData = await sendRequest(
			'signin',
			'POST',
			{
				name: formState.inputs.name.value.substring(3),
				password: formState.inputs.password.value,
			},
			{
				'Content-Type': 'application/json',
			}
		);
		if (responseData) {
			setUser(responseData);
		}
	};

	const isNew = formState.inputs.name.value.slice(0, 3) === '<!>';

	useEffect(() => {
		if (user) {
			setFormData(
				{
					name: {
						value: '',
						isValid: false,
					},
					password: {
						value: '',
						isValid: false,
					},
				},
				false
			);
			localStorage.setItem('myWorkUser', JSON.stringify(user));
		}
	}, [setFormData, user]);

	//>>>>>>>>>>>>>>>>>>>>>
	const showButton = () => {
		if (user === null) {
			return (
				<form>
					<Input
						id='name'
						element='input'
						type='text'
						label='Name'
						validators={[VALIDATOR_REQUIRE()]}
						errorText='Inserire il nome utente'
						onInput={inputHandler}
						initValue=''
						initIsValid={false}
					/>
					<Input
						id='password'
						element='input'
						type='password'
						label='Password'
						validators={[VALIDATOR_REQUIRE()]}
						errorText='Inserisci la password'
						onInput={inputHandler}
						initValue=''
						initIsValid={false}
					/>

					{isNew ? (
						<Button
							clname={'reverse big'}
							type='submit'
							disabled={!formState.isValid}
							onClick={postSignIn}
						>
							AddUser
						</Button>
					) : (
						<Button
							clname={'default big'}
							type='submit'
							disabled={!formState.isValid}
							onClick={postLogin}
						>
							Login
						</Button>
					)}
				</form>
			);
		} else {
			return (
				<form>
					<Button
						clname={'danger small'}
						disabled={false}
						type='submit'
						onClick={postLogout}
					>
						Logout
					</Button>
				</form>
			);
		}
	};
	//<<<<<<<<<<<<<<<<<<<<<

	return (
		<React.Fragment>
			{error && <ErrorModal error={error} onClear={clearError} />}
			{isLoading && <LoadingSpinner asOverlay />}
			<div className={classes.container}>{showButton()}</div>
		</React.Fragment>
	);
}

export default Login;
