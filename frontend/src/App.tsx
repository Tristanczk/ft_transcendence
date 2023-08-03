import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import RootPage from './pages/RootPage';
import NotFound from './pages/404';
import Dashboard from './pages/DashboardPage';
import SignIn from './pages/SignInPage';
import Chat from './pages/ChatPage';
import NavBar from './NavBar';
import Settings from './pages/SettingsPage';

const App: React.FC = () => (
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

export default App;
