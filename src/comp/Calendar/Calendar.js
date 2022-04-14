import React, { useState, useEffect } from 'react';

import DailyPlan from './DailyPlan';

import classes from './Calendar.module.css';

function Calendar() {
	const [startDay, setStartDay] = useState(new Date());
	const [days, setDays] = useState(null);

	const getWeekDates = () => {
		const weekDates = [];
		const getDayName = i => {
			switch (i) {
				case 0:
					return 'Domenica';
				case 1:
					return 'Lunedì';
				case 2:
					return 'Martedì';
				case 3:
					return 'Mercoledì';
				case 4:
					return 'Giovedì';
				case 5:
					return 'Venerdì';
				case 6:
					return 'Sabato';
			}
		};

		const getMonthName = month => {
			//todo: Chiamare dal database il nome dei mesi per le lingue
			// console.log(month);
			switch (month) {
				case 0:
					return 'Gennaio';
				case 1:
					return 'Febbraio';
				case 2:
					return 'Marzo';
				case 3:
					return 'Aprile';
				case 4:
					return 'Maggio';
				case 5:
					return 'Giugno';
				case 6:
					return 'Luglio';
				case 7:
					return 'Agosto';
				case 8:
					return 'Settembre';
				case 9:
					return 'Ottobre';
				case 10:
					return 'Novembre';
				case 11:
					return 'Dicembre';
			}
		};

		for (let i = 0; i < 7; i++) {
			let _date = new Date(
				startDay.getFullYear(),
				startDay.getMonth(),
				startDay.getDate() + i + 1 - startDay.getDay()
			);
			let _name = getDayName(_date.getDay());
			let _month = getMonthName(_date.getMonth());
			weekDates.push({
				name: _name,
				date: _date,
				month: _month,
			});
		}
		return weekDates;
	};

	/**
 * 
 * .toLocaleString('it-IT', {
				day: '2-digit',
				month: '2-digit',
				year: 'numeric',
				hour: '2-digit',
				minute: '2-digit',
			})
 */

	const getFullWeek = () => {
		// const weekStart = new Date(
		// 	startDay.getFullYear(),
		// 	startDay.getMonth(),
		// 	startDay.getDate() - startDay.getDay() + 1
		// );

		const weekDates = getWeekDates();
		console.log(weekDates);

		return weekDates.map(day => {
			console.log(day);
			return (
				<div key={day.id} className={`${classes.day} ${classes[day.name]}`}>
					<div key={day.id} className={classes.date}>
						{day.name}
						<br />{' '}
						{day.date.toLocaleString('it-IT', { day: '2-digit' }) +
							' - ' +
							day.month}
					</div>
					<DailyPlan day={day.date} />
					{/* {getDailyPlan(day.date)} */}
				</div>
			);
		});
	};

	useEffect(() => {
		let dal = getFullWeek();
		// console.log(dal);
		setDays(dal);
	}, [startDay]);

	const gotoNextWeek = () => {
		startDay.setDate(startDay.getDate() + 7);
		setStartDay(startDay);
		setDays(getFullWeek());
	};
	const gotoPrevWeek = () => {
		startDay.setDate(startDay.getDate() - 7);
		setStartDay(startDay);
		setDays(getFullWeek());
	};

	return (
		<div className={classes.conteiner}>
			<div className={classes.main}>
				<div className={classes.controls}>
					<p className={classes.navArrow} onClick={gotoPrevWeek}>
						{'<<'}
					</p>
					<p>Settimana in corso</p>
					<p className={classes.navArrow} onClick={gotoNextWeek}>
						{'>>'}
					</p>
				</div>
				{/* <div className={classes.calendar}>{getFullWeek()}</div> */}
				<div className={classes.calendar}>{days}</div>
			</div>
		</div>
	);
}

export default Calendar;
