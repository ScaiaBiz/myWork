import React, { useReducer, useEffect } from 'react';

import { validate } from './validators';

import classes from './Input.module.css';

const inputReducer = (state, action) => {
	switch (action.type) {
		case 'CHANGE':
			return {
				...state,
				value: action.val,
				isValid: validate(action.val, action.validators),
			};

		case 'TOUCH':
			return {
				...state,
				isTuched: true,
			};

		default:
			return state;
	}
};

const Input = props => {
	const [inputState, dispatch] = useReducer(inputReducer, {
		value: props.initValue || '',
		isTuched: false,
		isValid: props.initIsValid || false,
	});

	const { id, onInput } = props;
	const { value, isValid } = inputState;

	useEffect(() => {
		onInput(id, value, isValid);
	}, [id, value, isValid, onInput]);

	const changeHandler = e => {
		// console.log(e.target.value);
		dispatch({
			type: 'CHANGE',
			val: e.target.value,
			validators: props.validators,
		});
	};

	const clear = e => {
		e.target.value = '';
	};

	const toucHandler = () => {
		dispatch({ type: 'TOUCH' });
	};

	//todo: Create stato start time/end time registrare il valore DATE di inizio e quello di fine

	const getDateNow = e => {
		const date = new Date();
		let _d = date.getDay() + '/' + date.getMonth() + '/' + date.getFullYear();
		e.target.value = _d.toString();
	};

	const getTimeNow = e => {
		const time = new Date();
		let _t = time.getHours() + ':' + time.getMinutes();
		e.target.value = _t.toString();
		changeHandler(e);
	};

	const getDropdownList = e => {
		if (props.baseList) {
			switch (props.baseList) {
				case 'workType':
					return [
						{ id: 1, name: 'Analisi' },
						{ id: 2, name: 'Assistenza' },
						{ id: 3, name: 'Consulenza' },
						{ id: 4, name: 'Progettazione' },
						{ id: 5, name: 'Programmazione' },
					];

				case 'status':
					return [
						{ id: 1, name: 'TODO' },
						{ id: 2, name: 'ONGOING' },
						{ id: 3, name: 'COMPLETED' },
						{ id: 4, name: 'SUSPENDED' },
						{ id: 5, name: 'ABORTED' },
					];

				default:
					break;
			}
		} else {
			return props.list;
		}
	};

	const element = () => {
		switch (props.element) {
			case 'input':
				return (
					<input
						id={props.id}
						type={props.type}
						placeholder={props.placeholder}
						onChange={changeHandler}
						onBlur={toucHandler}
						value={inputState.value}
					/>
				);
			case 'checkbox':
				return (
					<input
						id={props.id}
						type={props.type}
						onChange={changeHandler}
						onBlur={toucHandler}
						value={inputState.value}
					/>
				);
			case 'radio':
				return (
					<div className={props.radio_dot}>
						{props.list.map(el => {
							return (
								<div className={classes.radio_container}>
									<label className={classes.radio_dot} htmlFor={el.id}>
										<input
											className={classes.radio1}
											id={el.id}
											type={props.type}
											onChange={changeHandler}
											onBlur={toucHandler}
											value={inputState.value}
											name={props.label}
										/>
										<div className={classes.radio_label}>{el.name}</div>
									</label>
								</div>
							);
						})}
					</div>
				);

			case 'time':
				return (
					<input
						id={props.id}
						type={props.type}
						onClick={getTimeNow}
						onChange={changeHandler}
						onBlur={toucHandler}
						value={inputState.value}
					/>
				);
			case 'data':
				return (
					<input
						id={props.id}
						type={props.type}
						onClick={getDateNow}
						onChange={changeHandler}
						onBlur={toucHandler}
						value={inputState.value}
					/>
				);
			case 'color':
				return (
					<input
						id={props.id}
						type={props.type}
						onChange={changeHandler}
						onBlur={toucHandler}
						value={inputState.value}
					/>
				);
			case 'dropdown':
				const list = getDropdownList();
				console.log(list);
				return (
					<React.Fragment>
						<input
							id={props.id}
							list={props.label}
							name={props.id}
							onMouseDown={clear}
							onFocus={clear}
							onChange={changeHandler}
							onBlur={toucHandler}
							value={inputState.value}
						/>
						<datalist id={props.label}>
							{list.map(el => {
								console.log(el);
								return <option value={el.name} />;
							})}
						</datalist>
					</React.Fragment>
				);
			case 'textarea':
				return (
					<textarea
						id={props.id}
						type={props.type}
						rows={props.rows || 3}
						onChange={changeHandler}
						onBlur={toucHandler}
						value={inputState.value}
					/>
				);
			default:
				break;
		}
	};

	return (
		<div
			className={`${classes.formCtrl} ${
				!inputState.isValid && inputState.isTuched && classes.formCtrl_invalid
			}`}
		>
			<label htmlFor={props.id}>{props.label}</label>

			{element()}

			{!inputState.isValid && inputState.isTuched && (
				<p id={props.id} className={classes.errorText}>
					{props.errorText}
				</p>
			)}
		</div>
	);
};

export default Input;
/**
 * 
 * ====================
 * ESEMPI
 * ====================
 * 
 * Radio:
 * ----------------
 * <Input
		id='radio'
		element='radio'
		type='radio'
		label='Attività svolta: '
		validators={[VALIDATOR_REQUIRE()]}
		onInput={inputHandler}
		initValue={false}
		initIsValid={false}
		list={[
			{ id: 1, name: 'Analisi' },
			{ id: 2, name: 'Assistenza' },
			{ id: 3, name: 'Consulenza' },
			{ id: 4, name: 'Progettazione' },
			{ id: 5, name: 'Programmazione' },
		]}
	/>
 * 

 */
