import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import RootPage from './pages/RootPage';
import Page404 from './pages/Page404';
import DashboardPage from './pages/DashboardPage';
import SignOutPage from './pages/SignOutPage';
import ChatPage from './pages/ChatPage';
import SettingsPage from './pages/SettingsPage';
import SignInPage42 from './pages/SignInPage42';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import SignInResult from './pages/SignInResult';
import { WebsocketProvider, socket } from './context/WebsocketContext';
import Test from './components/dashboard/friends/test';
import TrackingOnline from './components/TrackingOnline';

const App: React.FC = () => (
    <WebsocketProvider value={socket}>
        <TrackingOnline />
        <BrowserRouter>
            <NavBar />
            <Routes>
                <Route path="/" Component={RootPage} />
                <Route path="/dashboard" Component={DashboardPage} />
                <Route path="/chat" Component={ChatPage} />
                <Route path="/signin" Component={SignInPage} />
                <Route path="/signup" Component={SignUpPage} />
                <Route path="/signin42" Component={SignInPage42} />
                <Route path="/signout" Component={SignOutPage} />
                <Route path="/settings" Component={SettingsPage} />
                <Route path="/signin/result" Component={SignInResult} />
                <Route path="*" Component={Page404} />
            </Routes>
        </BrowserRouter>
    </WebsocketProvider>
);

export default App;
