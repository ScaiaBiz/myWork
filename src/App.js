import { useState, useContext } from 'react';
import { Route, Routes } from 'react-router-dom';

import { UserCxt } from './cxt/UserCxt';

import Login from './comp/Login/Login';

import Menu from './comp/Menu/Menu';
// import Day from './comp/page/Day';
// import Week from './comp/page/Week';
// import Backdrop from './comp/common/Backdrop';

import './App.css';

function App() {
	const LS_Area = useContext(UserCxt).LS_Area;
	const [user, setUser] = useState(JSON.parse(localStorage.getItem(LS_Area)));

	if (!user) {
		return (
			<div className='App'>
				<UserCxt.Provider
					value={{
						user: [user, setUser],
						LS_Area: LS_Area,
					}}
				>
					<Login />
				</UserCxt.Provider>
				<br />
			</div>
		);
	}

	return (
		<div className='App'>
			<UserCxt.Provider
				value={{
					user: [user, setUser],
					LS_Area: LS_Area,
				}}
			>
				<Menu />
				<Routes>
					{/* <Route path='/' element={<Login />} /> */}
					{/* <Route path='/week' element={<Week />} /> */}
					{/* <Route path='/backdrop' element={<Backdrop />} /> */}
				</Routes>
			</UserCxt.Provider>
		</div>
	);
}

export default App;
