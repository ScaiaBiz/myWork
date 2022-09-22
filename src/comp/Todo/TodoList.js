import React, { useState, useEffect } from 'react';

import { VALIDATOR_NO, VALIDATOR_REQUIRE } from '../../utils/validators';
import { useForm } from '../../hooks/form-hook';
import { useHttpClient } from '../../hooks/http-hooks';
import LoadingSpinner from '../../utils/LoadingSpinner';
import ErrorModal from '../../utils/ErrorModal';
import Backdrop from '../../utils/Backdrop'; //???

import Input from '../../utils/Input';
import Button from '../../utils/Button';

import classes from './TodoList.module.css';
import Todo from './Todo';

function TodoList({ parentId, projectName }) {
	const [todos, setTodos] = useState(null);
	const [todosEl, setTodosEl] = useState(null);
	const [animateLoading, setAnimateLoading] = useState(false);

	const [formState, inputHandler, setFormData] = useForm({
		todoDescription: { value: '', isValid: false },
		todoPriority: { value: '3', isValid: false },
	});

	const { isLoading, error, sendRequest, clearError } = useHttpClient();

	const updateTodos = id => {
		const newTodos = todos.filter(t => {
			if (t._id != id) {
				return false;
			}
		});
		console.log({ newTodos });
		setTodos(newTodos);
	};

	const loadTodos = async () => {
		console.log(formState);
		const _todos = await sendRequest('api/todo/list/' + parentId);
		setTodos(_todos.data);
	};

	const postNewTodo = async e => {
		e.preventDefault();
		console.log('Posting Todo');
		const el = await sendRequest(
			'api/todo/New',
			'POST',
			{
				projectId: parentId,
				text: formState.inputs.todoDescription.value,
				priority: formState.inputs.todoPriority.value,
			},
			{
				'Content-Type': 'application/json',
			}
		);
		formState.inputs.todoDescription.value = '';
		formState.inputs.todoDescription.isValid = false;
		formState.inputs.todoPriority.value = '';
		formState.inputs.todoPriority.isValid = false;
		setAnimateLoading(true);
		loadTodos();
	};

	useEffect(() => {
		loadTodos();
	}, []);

	useEffect(() => {
		if (todos) {
			const _t = todos.map(t => {
				return <Todo data={t} updateList={updateTodos} />;
			});
			setTodosEl(_t);
			setAnimateLoading(false);
		}
	}, [todos]);

	return (
		<React.Fragment>
			{error && <ErrorModal error={error} onClear={clearError} />}
			{animateLoading && isLoading && <LoadingSpinner asOverlay />}
			<div className={classes.container}>
				{projectName && <h2>{projectName}</h2>}
				Aggiungi nota:
				<div className={classes.input}>
					<Input
						id='todoDescription'
						element='textarea'
						type='textarea'
						rows={3}
						validators={[VALIDATOR_REQUIRE()]}
						onInput={inputHandler}
						initValue={''}
						initIsValid={false}
					/>
					<Input
						id='todoPriority'
						element='radio'
						type='radio'
						label='Priorità'
						list={[
							{ name: '1', id: 1 },
							{ name: '2', id: 2 },
							{ name: '3', id: 3 },
						]}
						// name='Urgente'
						validators={[VALIDATOR_NO()]}
						onInput={inputHandler}
						initValue={'3'}
						initIsValid={false}
					/>
					<Button
						clname={'default'}
						type='submit'
						disabled={!formState.isValid}
						onClick={postNewTodo}
					>
						+
					</Button>
				</div>
				<div className={classes.list}>{todosEl}</div>
			</div>
		</React.Fragment>
	);
}

export default TodoList;

//TODO: Migliorare pagina attività, non più con card ma con tabella - Gestione contatti Persona
