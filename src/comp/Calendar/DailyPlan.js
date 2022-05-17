import React, { useState, useEffect } from 'react';

import Card from '../Contacts/C_Utils/Card';

import classes from './DailyPlan.module.css';

function DailyPlan({ day, data, add, addHandler }) {
	const [plan, setPlan] = useState(null);

	const formatTime = time => {
		return new Date(time).toLocaleString('it-IT', {
			hour: '2-digit',
			minute: '2-digit',
		});
	};

	const convertToHour = minutes => {
		const timeFormat = n => ('00' + n).slice(-2);
		let min = minutes;
		let hour = Math.floor(min / 60);
		min = min - hour * 60;
		return timeFormat(hour) + ':' + timeFormat(min);
	};

	const getDailyPlan = () => {
		const tasks = data.map(l => {
			return <Card key={l._id} cardData={l} type={'CALENDAR'} />;
		});
		setPlan(tasks);
	};

	useEffect(() => {
		getDailyPlan();
	}, [day]);

	return (
		<div className={classes.container}>
			{plan}
			{add && (
				<span
					className={`material-icons ${classes.iconAdd}`}
					onClick={() => addHandler(day)}
				>
					add_circle_outline
				</span>
			)}
		</div>
	);
}

export default DailyPlan;
