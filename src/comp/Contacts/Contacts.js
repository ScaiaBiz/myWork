import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

import { useHttpClient } from './../../hooks/http-hooks';

import LoadingSpinner from '../../utils/LoadingSpinner';
import ErrorModal from '../../utils/ErrorModal';

import classes from './Contacts.module.css';

function Contacts() {
	const _contactsList = [
		{ _id: 1, value: 'Cliente 1', address: '/Contact:id' },
		{ _id: 2, value: 'Cliente 2', address: '/Contact:id' },
		{ _id: 3, value: 'Cliente 3', address: '/Contact:id' },
		{ _id: 4, value: 'Cliente 4', address: '/Contact:id' },
		{ _id: 11, value: 'Cliente 1', address: '/Contact:id' },
		{ _id: 12, value: 'Cliente 2', address: '/Contact:id' },
		{ _id: 13, value: 'Cliente 3', address: '/Contact:id' },
		{ _id: 14, value: 'Cliente 4', address: '/Contact:id' },
		{ _id: 21, value: 'Cliente 1', address: '/Contact:id' },
		{ _id: 22, value: 'Cliente 2', address: '/Contact:id' },
		{ _id: 23, value: 'Cliente 3', address: '/Contact:id' },
		{ _id: 24, value: 'Cliente 4', address: '/Contact:id' },
		{ _id: 33, value: 'Cliente 3', address: '/Contact:id' },
		{ _id: 34, value: 'Cliente 4', address: '/Contact:id' },
		{ _id: 44, value: 'Cliente 4', address: '/Contact:id' },
	];
	const { isLoading, error, sendRequest, clearError } = useHttpClient();
	//getto la lista dei contatti

	const [activeContacts, setActiveContacts] = useState(null);

	const getContactsList = async () => {
		const c = await sendRequest('api/contacts/contacts');
		return c.c;
	};

	const getContactsCard = async () => {
		const contactsList = await getContactsList();
		const contacts = contactsList.map(contact => {
			return (
				<NavLink
					className={classes.card}
					key={contact._id}
					to={contact.address}
				>
					<div className={classes.list} key={contact._id}>
						{contact.value}
					</div>
				</NavLink>
			);
		});
		setActiveContacts(contacts);
	};

	useEffect(() => {
		getContactsCard();
	}, []);

	const addNewContact = () => {};

	return (
		<React.Fragment>
			{error && <ErrorModal error={error} onClear={clearError} />}
			{isLoading && <LoadingSpinner asOverlay />}

			<div className={classes.contactsCointainer}>
				<div className={classes.card}>
					<div className={classes.list} key={0} onClick={addNewContact}>
						Aggiungi nuovo
					</div>
				</div>
				{activeContacts}
			</div>
		</React.Fragment>
	);
}

export default Contacts;
