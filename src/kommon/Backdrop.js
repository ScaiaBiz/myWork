import React from 'react';
import ReactDOM from 'react-dom';

import classes from './Backdrop.module.css';

const Backdrop = props => {
	console.log('livello ' + props.level);
	const getBackdropLevel = () => {
		switch (props.level) {
			case 'secondo':
				return document.getElementById('backdrop_2');
				break;

			default:
				return document.getElementById('backdrop');
				break;
		}
	};

	return ReactDOM.createPortal(
		<div
			className={`${classes.backdrop} ${classes.props.level}`}
			onClick={props.onClick}
		></div>,
		getBackdropLevel()
	);
};

export default Backdrop;
