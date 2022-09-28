import { useState, useContext } from 'react';
import { Routes, Route } from 'react-router-dom';

import { UserCxt } from './cxt/UserCxt';

import Login from './comp/Login/Login';

import Menu from './comp/Menu/Menu';

//Calendario
import Calendar from './comp/Calendar/Calendar';

//Contatti
import Contacts from './comp/Contacts/Contacts';
import ContactPage from './comp/Contacts/ContactPage/ContactPage';
import C_Projects from './comp/Contacts/ContactPage/Elements/C_Projects';
import C_Logs from './comp/Contacts/ContactPage/Elements/C_Logs';

//Impostazioni
import Settings from './comp/Settings/Settings';

// import Day from './comp/page/Day';
// import Week from './comp/page/Week';
// import Backdrop from './comp/common/Backdrop';

import './App.css';

function App() {
	const LS_Area = useContext(UserCxt).LS_Area;
	const [user, setUser] = useState(JSON.parse(localStorage.getItem(LS_Area)));
	const [projectTodos, setProjectTodos] = useState('Prova');
	const [showProjectTodos, setShowProjectTodos] = useState(false);

	const contextData = {
		user: [user, setUser],
		LS_Area: LS_Area,
		ProjectTodos: [projectTodos, setProjectTodos],
		showProjectTodos: [showProjectTodos, setShowProjectTodos],
	};

	if (!user) {
		return (
			<div className='App'>
				<UserCxt.Provider value={contextData}>
					<Login />
				</UserCxt.Provider>
				<br />
			</div>
		);
	}

	return (
		<div className='App'>
			<UserCxt.Provider value={contextData}>
				<Menu />
				<div className='Content'>
					<Routes>
						<Route path='/myWork/Calendar' element={<Calendar />} />
						<Route path='/myWork/Contacts' element={<Contacts />} />
						<Route
							path='/myWork/Contacts/:contactId/*'
							element={<ContactPage />}
						>
							<Route path='Projects' element={<C_Projects />} />
							<Route path='Logs' element={<C_Logs />} />
							<Route path='Balance' />
							<Route path='Data' />
						</Route>
						<Route path='/myWork/Settings' element={<Settings />} />
						{/* <Route path='/backdrop' element={<Backdrop />} /> */}
					</Routes>
				</div>
			</UserCxt.Provider>
		</div>
	);
}

export default App;
