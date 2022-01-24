import React from 'react';

import classes from './C_Header.module.css';

function ContactHeader({ contact }) {
	return (
		<div className={classes.contactHeader}>
			<div className={classes.contactName}>{contact?.name}</div>
			<div className={classes.contactData}>
				<div>
					{contact?.address?.street}, {contact?.address?.number}
				</div>
				<div>
					{contact?.address?.postCode} - {contact?.address?.city}
				</div>
			</div>
		</div>
	);
}

export default ContactHeader;
