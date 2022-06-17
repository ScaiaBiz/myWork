import { useState, useCallback, useRef, useEffect } from 'react';

export const useHttpClient = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const APP_name = process.env.REACT_APP_NAME;
	const SRV_name = process.env.REACT_APP_SRVNAME;
	const SRV_port = process.env.REACT_APP_SRVPORT;

	const activeHttpReq = useRef([]);

	const currentAppName = 'my-work';

	const evalSrv = () => {
		// return `http://192.168.1.21:${SRV_port}/`;
		return `https://my-work-server.herokuapp.com/`;
		// return `http://${SRV_name}:${SRV_port}/`;
		if (process.env.NODE_ENV === 'production') {
		}
		// const SRV = `http://${SRV_name}:5000/`;
	};

	const SRV = evalSrv();

	const sendRequest = useCallback(
		async (url, method = 'GET', body = undefined, headers = {}) => {
			// console.log(SRV);
			// console.log('Url: ' + url);
			//> Gestione tempo minimo di caricamento
			const endLoading = () => {
				setTimeout(() => {
					setIsLoading(false);
				}, 250);
			};

			setIsLoading(true);
			if (APP_name !== currentAppName) {
				setError('Nome applicazione errato. Verificare variabili ambientali');
				// setIsLoading(false)
				endLoading();
				return;
			}
			const httpAbortCtrl = new AbortController();
			activeHttpReq.current.push(httpAbortCtrl);
			try {
				const response = await fetch(SRV + url, {
					method: method,
					body: JSON.stringify(body),
					// body: body,
					headers: headers,
					signal: httpAbortCtrl.signal,
				});
				const responseData = await response.json();

				activeHttpReq.current = activeHttpReq.current.filter(
					reqCtrl => reqCtrl !== httpAbortCtrl
				);

				console.log(responseData);
				if (responseData.message && responseData.errorStatus) {
					throw new Error(responseData.message);
				}
				// setIsLoading(false)
				endLoading();

				return responseData;
			} catch (err) {
				setError(err.message || 'Something went wrong, please try again');
				// setIsLoading(false)
				endLoading();
				throw err;
			}
		},
		[]
	);

	const clearError = () => {
		setError(null);
	};

	useEffect(() => {
		return () => {
			activeHttpReq.current.forEach(abortCtrl => abortCtrl.abort());
		};
	}, []);

	return { isLoading, error, sendRequest, clearError };
};
