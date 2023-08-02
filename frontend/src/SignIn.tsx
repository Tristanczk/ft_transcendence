import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface User {
	id: number;
	login: string;
	// add more fields as per your user structure
}

const SignIn: React.FC = () => {
	const location = useLocation();
	const [token, setToken] = useState<string | null>(null);
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const code = new URLSearchParams(location.search).get('code');

		if (!code) {
			console.error('No authorization code found');
			setLoading(false);
			return;
		}

		fetch('https://api.intra.42.fr/oauth/token', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				grant_type: 'authorization_code',
				client_id: process.env.REACT_APP_API42_UID,
				client_secret: process.env.REACT_APP_API42_SECRET,
				code: code,
				redirect_uri: 'http://localhost:3000/signin'
			})
		})
			.then(response => { const res = response.json(); console.log(`/oauth/token response: ${res}`); return res })
			.then(data => {
				setToken(data.access_token);
				return fetch('https://api.intra.42.fr/v2/me', {
					headers: { 'Authorization': `Bearer ${data.access_token}` },
				});
			})
			.then(response => { const res = response.json(); console.log(`/me response: ${res}`); return res })
			.then(user => {
				console.log("user: ", user)
				setUser(user);
				setLoading(false);
			})
			.catch(error => {
				console.error('Failed to sign in or fetch user data:', error);
				setLoading(false);
			});
	}, [location]);

	if (loading) {
		return <div>Signing in...</div>;
	}

	if (user) {
		return <div>Successfully signed in! Welcome, {user.login}</div>;
	} else if (token) {
		return <div>{token}</div>
	} else {
		return <div>Sign in failed</div>;
	}
};

export default SignIn;
