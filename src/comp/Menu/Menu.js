import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

import Login from '../Login/Login';

import classes from './Menu.module.css';

function Menu() {
	const menuItems = [
		{ _id: 10, value: ' Attività ', address: '/Calendar' },
		{ _id: 20, value: ' Contatti ', address: '/Contacts' },
		{ _id: 30, value: ' Registri ', address: '/Logs' },
		{ _id: 40, value: ' Impostazioni ', address: '/Settings' },
	];

	const [isActive, setIsActive] = useState(false);

	const isActiveHandler = () => {
		setIsActive(!isActive);
	};

	const getMenuItems = () => {
		const items = menuItems.map(i => {
			return (
				<NavLink
					className={navData => (navData.isActive ? classes.active : classes.a)}
					key={menuItems._id}
					to={i.address}
				>
					<div key={i} className={classes.list} onClick={isActiveHandler}>
						{i.value}
					</div>
				</NavLink>
			);
		});
		return items;
	};

	return (
		<React.Fragment>
			<div
				className={`${classes.burger} ${isActive ? classes.hide : ''}`}
				onClick={isActiveHandler}
			>
				<span className={classes.burger_bar} />
				<span className={classes.burger_bar} />
				<span className={classes.burger_bar} />
			</div>
			<div className={`${classes.container} ${isActive ? classes.show : ''}`}>
				{getMenuItems()}
				<Login key='login' w_button='100' />
			</div>
		</React.Fragment>
	);
}

export default Menu;
