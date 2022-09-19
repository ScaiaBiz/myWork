export const getWeekDates = startDay => {
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

export const convertMinToHour = value => {
	const timeFormat = n => ('00' + n).slice(-2);
	let min = value;
	let hour = Math.floor(min / 60);
	min = min - hour * 60;
	return timeFormat(hour) + ':' + timeFormat(min);
};

export const convertMillisecondsToHours = value => {
	return convertMinToHour(Math.round(value / 60000));
};

export const HourMinFromDateString = date => {
	return new Date(date).toLocaleString('it-IT', {
		hour: '2-digit',
		minute: '2-digit',
	});
};

export const FullDateTimeFromDateString = date => {
	return new Date(date).toLocaleString('it-IT', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	});
};

export const convertTimeStringToMilliseconds = (h, m) => {
	return (Number(h) * 60 + Number(m)) * 60000;
};
