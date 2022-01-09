import React from 'react';
import { NavLink } from 'react-router-dom';

import classes from './Menu.module.css';

function Menu() {
	const menuItems = [
		{ _id: 1, value: 'Attività', address: '/' },
		{ _id: 2, value: 'Contatti', address: '/contacts' },
		{ _id: 3, value: 'Registri', address: '/logs' },
		{ _id: 4, value: 'Impostazioni', address: '/setups' },
	];

	const getMenuItems = () => {
		const items = menuItems.map(i => {
			return (
				<div className={classes.list} key={i._id}>
					{/* <NavLink
						className={navData => (navData.isActive ? classes.active : '')}
						to={i.address}
					>
						{i.name}
					</NavLink> */}
				</div>
			);
		});
		return items;
	};

	return <div className={classes.container}>{getMenuItems()}</div>;
}

export default Menu;
