import React, { useState, useEffect } from 'react';

import { VALIDATOR_REQUIRE } from '../validators';
import { useHttpClient } from '../../hooks/http-hooks';
import { useForm } from '../../hooks/form-hook';

import Input from '../Input';

import ErrorModal from '../ErrorModal';
import LoadingSpinner from '../LoadingSpinner';

function Find({
	url,
	setRes,
	setSecondaryRes,
	secondaryData,
	label,
	inputId,
	driver,
	trigger,
	resName = 'data',
}) {
	const { isLoading, error, sendRequest, clearError } = useHttpClient();

	const [formState, inputHandler, setFormData] = useForm({
		[inputId]: { value: '', isValid: false },
	});

	const [data, setData] = useState(null);
	const [list, setList] = useState(null);
	const [fullRess, setFullRess] = useState(null);

	const getData = async () => {
		const d = await sendRequest(url);
		console.log(d);
		setFullRess(d);
		const res = d[resName]?.map(el => {
			return (
				<p key={el._id} id={el._id}>
					{el.name}
				</p>
			);
		});
		const l = d[resName]?.map(el => {
			return { key: el._id, id: el._id, name: el[driver] };
		});
		setList(l);
		setData(res);
	};

	useEffect(() => {
		getData();
	}, [trigger]);

	useEffect(() => {
		if (formState.isValid) {
			let val = formState?.inputs[inputId]?.value;
			let valueId = list.map(el => {
				if (el.name === val) {
					setRes(el.id);
					if (setSecondaryRes) {
						setSecondaryRes(el.name);
					}
				}
			});
		}
	}, [formState.isValid, formState.inputs[inputId].value]);

	return (
		<div>
			{data && (
				<Input
					id={inputId}
					element='dropdown'
					type='dropdown'
					list={list}
					label={label}
					validators={[VALIDATOR_REQUIRE()]}
					errorText='Campo obbligatorio'
					onInput={inputHandler}
					initValue=''
					initIsValid={false}
				/>
			)}
		</div>
	);
}

export default Find;
