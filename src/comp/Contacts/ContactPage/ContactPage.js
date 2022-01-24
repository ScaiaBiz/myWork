import React, { useState, useEffect } from 'react';
import { useParams, Outlet } from 'react-router-dom';

import { useHttpClient } from './../../../hooks/http-hooks';

import LoadingSpinner from '../../../utils/LoadingSpinner';
import ErrorModal from '../../../utils/ErrorModal';

import Header from './Elements/C_Header';
import C_Navigation from './Elements/C_Navigation';

import classes from './ContactPage.module.css';

function ContactPage() {
	const param = useParams();
	const [contact, setContact] = useState(null);

	const { isLoading, error, sendRequest, clearError } = useHttpClient();

	const getContact = async () => {
		const c = await sendRequest(`api/contacts/${param.contactId}`);
		setContact(c.c);
	};

	useEffect(() => {
		getContact();
	}, []);

	return (
		<React.Fragment>
			{error && <ErrorModal error={error} onClear={clearError} />}
			{isLoading && <LoadingSpinner asOverlay />}
			<div className={classes.container}>
				<Header contact={contact} />
				<C_Navigation />
				<Outlet />
			</div>
		</React.Fragment>
	);
}

export default ContactPage;
