import React from 'react';

import classes from './LoadingSpinner.module.css';

const LoadingSpinner = props => {
	console.log('im here');
	return (
		<div className={classes.loadingSpinner__overlay}>
			<div className={classes.ldsDualRing}></div>
		</div>
	);
};

export default LoadingSpinner;
