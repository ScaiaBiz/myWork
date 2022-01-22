import React from 'react';

import Modal from './Modal';
import Button from './Button';

const ErrorModal = props => {
	return (
		<Modal
			onCancel={props.onClear}
			header='Error!'
			headerClass='header danger'
			show={props.error}
			footer={
				<Button clname='danger' onClick={props.onClear} autofocus={true}>
					Okay
				</Button>
			}
		>
			<p>{props.error}</p>
		</Modal>
	);
};

export default ErrorModal;
