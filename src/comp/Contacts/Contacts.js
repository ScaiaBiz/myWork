import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { NavLink } from 'react-router-dom';

import { useHttpClient } from './../../hooks/http-hooks';

import NewContact from './NewContact/NewContact';

import LoadingSpinner from '../../utils/LoadingSpinner';
import ErrorModal from '../../utils/ErrorModal';
import Backdrop from '../../utils/Backdrop';

import classes from './Contacts.module.css';

function Contacts() {
	const [activeContacts, setActiveContacts] = useState(null);
	const [showNewContactForm, setShowNewContactForm] = useState(false);

	const { isLoading, error, sendRequest, clearError } = useHttpClient();

	const addNewHandler = () => {
		setShowNewContactForm(!showNewContactForm);
	};

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
						<h2>{contact.name}</h2>
						<h4>{contact.address.city}</h4>
					</div>
				</NavLink>
			);
		});
		setActiveContacts(contacts);
	};

	useEffect(() => {
		getContactsCard();
	}, []);

	const addNewContact = () => {
		const formNewContat = (
			<React.Fragment>
				<Backdrop onClick={addNewHandler} />
				<NewContact clear={addNewHandler} />
			</React.Fragment>
		);
		return ReactDOM.createPortal(
			formNewContat,
			document.getElementById('modal-hook')
		);
	};

	return (
		<React.Fragment>
			{error && <ErrorModal error={error} onClear={clearError} />}
			{isLoading && <LoadingSpinner asOverlay />}
			{showNewContactForm && addNewContact()}

			<div className={classes.contactsCointainer}>
				<div className={classes.card}>
					<div className={classes.list} key={0} onClick={addNewHandler}>
						<h1>Aggiungi nuovo</h1>
					</div>
				</div>
				{activeContacts}
			</div>
		</React.Fragment>
	);
}

export default Contacts;
