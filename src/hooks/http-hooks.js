import { useState, useCallback, useRef, useEffect } from 'react';

export const useHttpClient = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	const currentAppName = 'my-work2';

	const activeHttpReq = useRef([]);

	const APP_name = process.env.REACT_APP_NAME;
	const SRV_name = process.env.REACT_APP_SRVNAME;
	const SRV_port = process.env.REACT_APP_SRVPORT;

	const SRV = `${SRV_name}:${SRV_port}`;

	const sendRequest = useCallback(
		async (url, method = 'GET', body = undefined, headers = {}) => {
			setIsLoading(true);
			if (APP_name !== currentAppName) {
				console.log('error');
				setError('Nome applicazione errato. Verificare variabili ambientali');
				setIsLoading(false);
				return;
			}
			const httpAbortCtrl = new AbortController();
			activeHttpReq.current.push(httpAbortCtrl);
			try {
				const response = await fetch(SRV + url, {
					method: method,
					body: JSON.stringify(body),
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
				setIsLoading(false);
				return responseData;
			} catch (err) {
				setError(err.message || 'Something went wrong, please try again');
				setIsLoading(false);
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
