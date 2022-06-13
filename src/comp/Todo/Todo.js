import React from 'react';

import { useHttpClient } from '../../hooks/http-hooks';
import ErrorModal from '../../utils/ErrorModal';
import LoadingSpinner from '../../utils/LoadingSpinner';

import classes from './Todo.module.css';

function Todo({ data, updateList }) {
	const { isLoading, error, sendRequest, clearError } = useHttpClient();

	let _date = new Date(data.postingDate);

	const deleteTodo = async () => {
		const deleted = await sendRequest(
			'api/todo/deleteTodo/',
			'POST',
			{ todoId: data._id },
			{ 'Content-Type': 'application/json' }
		);
		updateList(deleted.data._id);
	};

	return (
		<React.Fragment>
			{error && <ErrorModal error={error} onClear={clearError} />}
			{isLoading && <LoadingSpinner asOverlay />}
			<div
				className={`${classes.container} ${
					classes['priority' + data.priority]
				}`}
				key={data._id}
			>
				<div className={classes.content}>
					<h3>{_date.toLocaleDateString('it-IT')}</h3>
					<p className={classes.text}>{data.text}</p>
				</div>
				<div className={classes.controllers}>
					<div className={classes.done}>Fatto</div>
					<div className={classes.del} onClick={deleteTodo}>
						Elimina
					</div>
				</div>
			</div>
		</React.Fragment>
	);
}

export default Todo;
