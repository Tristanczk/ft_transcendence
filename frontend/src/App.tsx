import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import RootPage from './pages/RootPage';
import NotFound from './404';
import Dashboard from './pages/Dashboard';
import SignIn from './pages/SignIn';
import Chat from './pages/Chat';
import NavBar from './NavBar';
import Settings from './pages/Settings';

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <NavBar />
            <Routes>
                <Route path="/" Component={RootPage} />
                <Route path="/dashboard" Component={Dashboard} />
                <Route path="/chat" Component={Chat} />
                <Route path="/signin" Component={SignIn} />
                <Route path="/settings" Component={Settings} />
                <Route path="*" Component={NotFound} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
