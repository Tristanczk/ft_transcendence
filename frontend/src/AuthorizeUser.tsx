import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthorizeUser: React.FC = () => {
	const navigate = useNavigate();

	useEffect(() => {
		const userIsLoggedIn = checkIfUserIsLoggedIn();

		if (!userIsLoggedIn) {
			window.location.href = `https://api.intra.42.fr/oauth/authorize?client_id=${process.env.REACT_APP_API42_UID}&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fsignin&response_type=code`
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
