import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import RootPage from './pages/RootPage';
import NotFound from './pages/404';
import Dashboard from './pages/DashboardPage';
import SignInPage from './pages/SignInPage';
import SignOutPage from './pages/SignOutPage';
import Chat from './pages/ChatPage';
import NavBar from './components/NavBar';
import Settings from './pages/SettingsPage';

const App: React.FC = () => (
    <BrowserRouter>
        <NavBar />
        <Routes>
            <Route path="/" Component={RootPage} />
            <Route path="/dashboard" Component={Dashboard} />
            <Route path="/chat" Component={Chat} />
            <Route path="/signin" Component={SignInPage} />
            <Route path="/signout" Component={SignOutPage} />
            <Route path="/settings" Component={Settings} />
            <Route path="*" Component={NotFound} />
        </Routes>
    </BrowserRouter>
);

export default App;
