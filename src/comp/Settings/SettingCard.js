import React, { useState, useEffect } from 'react';

import classes from './SettingCard.module.css';

function SettingCard({ setting }) {
	// console.log(Object.keys(setting.value));
	const [settingsHeader, setSettingsHeader] = useState(null);
	const [settingsValue, setSettingsValue] = useState(null);

	const getSettingsHeader = () => {
		const data = setting.value[0];
		const headers = Object.keys(data);
		setSettingsHeader(headers);
		// getSettingsValue();
	};

	const getSettingsValue = () => {
		console.log(settingsHeader);

		const head = () => {
			return (
				<div className={`${classes.values} ${classes.gridHeader}`}>
					{settingsHeader.map(value => {
						return <div className={classes.val}>{value}</div>;
					})}
				</div>
			);
		};

		const body = setting.value.map(v => {
			return (
				<div className={classes.values}>
					{settingsHeader.map(value => {
						return <div className={classes.val}>{v[value]}</div>;
					})}
				</div>
			);
		});
		const data = [head(), ...body];
		setSettingsValue(data);
	};

	useEffect(() => {
		getSettingsHeader();
	}, []);

	useEffect(() => {
		if (settingsHeader) {
			getSettingsValue();
		}
	}, [settingsHeader]);

	return (
		<div className={classes.container}>
			<h1>{setting.name}</h1>
			<br />
			{settingsValue}
		</div>
	);
}

export default SettingCard;
