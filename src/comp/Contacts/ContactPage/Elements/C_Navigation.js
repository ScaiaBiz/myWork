import React from 'react';
import { NavLink } from 'react-router-dom';

import classes from './C_Navigation.module.css';

function C_Navigation() {
	return (
		<div className={classes.container}>
			<NavLink
				className={navData => (navData.isActive ? classes.active : classes.a)}
				to='Projects'
			>
				Progetti
			</NavLink>
			<NavLink
				className={navData => (navData.isActive ? classes.active : classes.a)}
				to='Logs'
			>
				Attività
			</NavLink>
			<NavLink
				className={navData => (navData.isActive ? classes.active : classes.a)}
				to='Billing'
			>
				Fatturazione
			</NavLink>
			<NavLink
				className={navData => (navData.isActive ? classes.active : classes.a)}
				to='Data'
			>
				Dati
			</NavLink>
			{/* <NavLink className={classes.cross} to=''>
				X
			</NavLink> */}
		</div>
	);
}

export default C_Navigation;
