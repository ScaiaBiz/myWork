import React from 'react';

import { useHttpClient } from '../../hooks/http-hooks';
import ErrorModal from '../../utils/ErrorModal';
import LoadingSpinner from '../../utils/LoadingSpinner';
import IconController from '../../utils/IconController';

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

	const doneTodo = async () => {
		const done = await sendRequest(
			'api/todo/done/',
			'POST',
			{ todoId: data._id },
			{ 'Content-Type': 'application/json' }
		);
		updateList(done.data._id);
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
				{!data.done && (
					<div className={classes.controllers}>
						<IconController
							type='DONE'
							size='rem3'
							color='green'
							action={doneTodo}
						/>
						<IconController type='EDIT' size='rem2' color='sky' />
						<IconController
							type='DELETE'
							size='rem3'
							color='red'
							action={deleteTodo}
						/>
					</div>
				)}
			</div>
		</React.Fragment>
	);
}

export default Todo;
