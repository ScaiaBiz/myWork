import { createContext } from 'react';

export const UserCxt = createContext({
	user: null,
	LS_Area: 'myWorkUser',
	ProjectTodos: 'Nessun progetto nel contesto user',
	showProjectTodos: null,
});
