import React from 'react';
import { NavLink } from 'react-router-dom';

import Login from '../Login/Login';

import classes from './Menu.module.css';

function Menu() {
	const menuItems = [
		{ _id: 10, value: ' Attività ', address: '/' },
		{ _id: 20, value: ' Contatti ', address: '/Contacts' },
		{ _id: 30, value: ' Registri ', address: '/Logs' },
		{ _id: 40, value: ' Impostazioni ', address: '/Setups' },
	];

	const getMenuItems = () => {
		const items = menuItems.map(i => {
			return (
				<NavLink
					className={navData => (navData.isActive ? classes.active : '')}
					key={menuItems._id}
					to={i.address}
				>
					<div className={classes.list}>{i.value}</div>
				</NavLink>
			);
		});
		return items;
	};

	return (
		<div className={classes.container}>
			{getMenuItems()}
			<Login w_button='100' />
		</div>
	);
}

export default Menu;
