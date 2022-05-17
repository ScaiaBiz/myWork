import React, { useState, useEffect } from 'react';
import ReactDom from 'react-dom';

import DailyPlan from './DailyPlan';
import NewActivity from './New/NewActivity';
//TODO:Valutare rimozione

import { useHttpClient } from '../../hooks/http-hooks';
import LoadingSpinner from '../../utils/LoadingSpinner';
import ErrorModal from '../../utils/ErrorModal';
import Backdrop from '../../utils/Backdrop';

import classes from './Calendar.module.css';

function Calendar() {
	const { isLoading, error, sendRequest, clearError } = useHttpClient();

	const [startDay, setStartDay] = useState(new Date());
	const [today, setToday] = useState(new Date());
	const [days, setDays] = useState(null);
	const [dayAdd, setDayAdd] = useState(null);
	const [reload, setReload] = useState(false);
	useEffect(() => {
		setToday(today?.setDate(today?.getDate() - 1));
	}, []);

	const [showNewLogForm, setShowNewLogForm] = useState(false);

	const addNewHandler = day => {
		if (day) {
			setDayAdd(day);
		}
		setShowNewLogForm(!showNewLogForm);
	};

	const addNewActivity = () => {
		const formNewActivity = (
			<React.Fragment>
				<Backdrop onClick={addNewHandler} />
				<NewActivity
					clear={addNewHandler}
					day={dayAdd}
					setReload={setReload}
					reload={reload}
				/>
			</React.Fragment>
		);
		return ReactDom.createPortal(
			formNewActivity,
			document.getElementById('modal-hook')
		);
	};

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

		console.log(new Date(startDay));

		for (let i = 0; i < 7; i++) {
			let _date;
			if (startDay.getDay() === 0) {
				_date = new Date(
					startDay.getFullYear(),
					startDay.getMonth(),
					startDay.getDate() + i - startDay.getDay() - 6
				);
			} else {
				_date = new Date(
					startDay.getFullYear(),
					startDay.getMonth(),
					startDay.getDate() + i - startDay.getDay() + 1
				);
			}
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

	const getTasks = async (start, end) => {
		const startDay =
			start.getFullYear() + 'e' + start.getMonth() + 'e' + start.getDate();
		const endDay =
			end.getFullYear() + 'e' + end.getMonth() + 'e' + end.getDate();

		console.log(startDay + ' - ' + endDay);
		const logs = await sendRequest(
			'api/log/getDailyPlan/' + startDay + '-' + endDay
		);
		return logs.logs;
	};

	const getFullWeek = async () => {
		const weekDates = getWeekDates();
		const tasks = await getTasks(
			weekDates[0].date,
			weekDates[weekDates.length - 1].date
		);
		let i = 0;
		return weekDates.map(day => {
			i++;
			const dayTasks = tasks.filter(t => {
				if (t.startWork) {
					return (
						Number(t.startWork.slice(8, 10)) === Number(day.date.getDate())
					);
				}
				return Number(t.dueDate.slice(8, 10)) === Number(day.date.getDate());
			});
			return (
				<div
					key={'calendar_' + i}
					className={`${classes.day} ${classes[day.name]}`}
				>
					<div key={'calendar_' + i * 1000} className={classes.date}>
						{day.name}
						<br />{' '}
						{day.date.toLocaleString('it-IT', { day: '2-digit' }) +
							' - ' +
							day.month}
					</div>
					<DailyPlan
						key={'calendar_' + i + i * 1000}
						day={day.date}
						data={dayTasks}
						add={day.date >= today}
						addHandler={addNewHandler}
						reload={reload}
					/>
				</div>
			);
		});
	};

	const gotoNextWeek = () => {
		let t = startDay.setDate(startDay.getDate() + 7);
		setStartDay(new Date(t));
	};
	const gotoPrevWeek = () => {
		let t = startDay.setDate(startDay.getDate() - 7);
		setStartDay(new Date(t));
	};

	useEffect(async () => {
		let dal = await getFullWeek();
		setDays(dal);
	}, [startDay]);

	const reloadHandler = async () => {
		console.log('showNewLogForm: ' + showNewLogForm);
		// if (showNewLogForm) {
		// 	setShowNewLogForm(false);
		// }
		let dal = await getFullWeek();
		setDays(dal);
		setReload(false);
	};

	useEffect(() => {
		console.log('here for reload: ' + reload);
		if (reload) {
			reloadHandler();
			setReload(!reload);
		}
	}, [reload]);

	return (
		<React.Fragment>
			{error && <ErrorModal error={error} onClear={clearError} />}
			{isLoading && <LoadingSpinner asOverlay />}
			{showNewLogForm && addNewActivity()}
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
					<div className={classes.calendar}>{days}</div>
				</div>
			</div>
		</React.Fragment>
	);
}

export default Calendar;
