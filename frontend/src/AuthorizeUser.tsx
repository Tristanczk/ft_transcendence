import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthorizeUser: React.FC = () => {
	const navigate = useNavigate();

	useEffect(() => {
		const userIsLoggedIn = checkIfUserIsLoggedIn();

		if (!userIsLoggedIn) {
			axios.get('http://localhost:3333/auth/authorize/42').then(response => {
				console.log(response.data);
				window.location.href = response.data;
			});
		} else {
			navigate('/dashboard');
		}
	}, [navigate]);

	return (
		<div>
			Checking login status...
		</div>
	);
};

function checkIfUserIsLoggedIn(): boolean {
	return false;
}

export default AuthorizeUser;
