import React, { useEffect } from 'react';

const AuthorizeUser: React.FC = () => {
	useEffect(() => {
		window.location.href = `https://api.intra.42.fr/oauth/authorize?client_id=${process.env.REACT_APP_API42_UID}&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fsignin&response_type=code`;
	}, []);

	return (
		<div>
			Checking login status...
		</div>
	);
};

export default AuthorizeUser;
