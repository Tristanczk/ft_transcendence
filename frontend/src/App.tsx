import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import RootPage from './pages/RootPage';
import Page404 from './pages/Page404';
import DashboardPage from './pages/DashboardPage';
import SignInPage from './pages/SignInPage';
import SignOutPage from './pages/SignOutPage';
import ChatPage from './pages/ChatPage';
import SettingsPage from './pages/SettingsPage';

const App: React.FC = () => (
    <BrowserRouter>
        <NavBar />
        <Routes>
            <Route path="/" Component={RootPage} />
            <Route path="/dashboard" Component={DashboardPage} />
            <Route path="/chat" Component={ChatPage} />
            <Route path="/signin" Component={SignInPage} />
            <Route path="/signout" Component={SignOutPage} />
            <Route path="/settings" Component={SettingsPage} />
            <Route path="*" Component={Page404} />
        </Routes>
    </BrowserRouter>
);

export default App;
