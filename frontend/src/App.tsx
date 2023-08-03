import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AuthorizeUser from './AuthorizeUser';
import NotFound from './NotFound';
import Dashboard from './Dashboard';
import SignIn from './SignIn';

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" Component={AuthorizeUser} />
                <Route path="/dashboard" Component={Dashboard} />
                <Route path="/signin" Component={SignIn} />
                <Route Component={NotFound} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
