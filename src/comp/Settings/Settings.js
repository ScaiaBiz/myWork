import React, { useState, useEffect } from 'react';
import ReactDom from 'react-dom';

import SettingCard from './SettingCard';

import { useHttpClient } from '../../hooks/http-hooks';
import LoadingSpinner from '../../utils/LoadingSpinner';
import ErrorModal from '../../utils/ErrorModal';

import classes from './Settings.module.css';

function Settings() {
	const { isLoading, error, sendRequest, clearError } = useHttpClient();

	const [settingsData, setSettingsData] = useState();
	const [settingsVisual, setSettingsVisual] = useState(null);

	const drawSettingsVisula = () => {
		const visual = settingsData.map(set => {
			//todo: Creare componente SettingCard
			return <SettingCard setting={set} />;
		});
		setSettingsVisual(visual);
	};

	useEffect(() => {
		if (settingsData) {
			drawSettingsVisula();
		}
	}, [settingsData]);

	const getSettingsData = async () => {
		const list = await sendRequest('api/settings/list');
		setSettingsData(list.data);
	};

	useEffect(() => {
		getSettingsData();
	}, []);

	return (
		<React.Fragment>
			{error && <ErrorModal error={error} onClear={clearError} />}
			{isLoading && <LoadingSpinner asOverlay />}
			<div className={classes.container}>{settingsVisual}</div>
		</React.Fragment>
	);
}

export default Settings;
