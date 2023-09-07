import React, { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import Page404 from './pages/Page404';
import DashboardPage from './pages/DashboardPage';

import SignOutPage from './pages/SignOutPage';
import ChatPage from './pages/ChatPage';
import SettingsPage from './pages/SettingsPage';
import SignInPage42 from './pages/SignInPage42';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import { WebsocketProvider, socket } from './context/WebsocketContext';
import TrackingOnline from './components/TrackingOnline';
import BattlePage from './pages/BattlePage';
import ClassicPage from './pages/ClassicPage';
import { UserProvider } from './context/UserContext';
import UserPage from './pages/UserPage';
import LeaderboardPage from './pages/LeaderboardPage';
import { AuthAxiosProvider } from './context/AuthAxiosContext';

const App: React.FC = () => {
    const [isChatVisible, setIsChatVisible] = useState(false);

    const toggleChatVisibility = () => {
        console.log('toggleChatVisibility');
        setIsChatVisible((prev) => !prev);
    };

    return (
        <WebsocketProvider value={socket}>
            <UserProvider>
                <AuthAxiosProvider>
                    <TrackingOnline />
                    <BrowserRouter>
                        <NavBar toggleChatVisibility={toggleChatVisibility} />
                        {<ChatPage isChatVisible={isChatVisible}/>}
                        <Routes>
                            <Route path="/" Component={HomePage} />
                            <Route path="/battle" Component={BattlePage} />
                            <Route path="/classic" Component={ClassicPage} />
                            <Route
                                path="/dashboard"
                                Component={DashboardPage}
                            />
                            <Route
                                path="/dashboard/:idUserToView"
                                Component={UserPage}
                            />
                            <Route
                                path="/leaderboard"
                                Component={LeaderboardPage}
                            />
                            <Route path="/signin" Component={SignInPage} />
                            <Route path="/signup" Component={SignUpPage} />
                            <Route
                                path="/signin42"
                                Component={SignInPage42}
                            />
                            <Route path="/signout" Component={SignOutPage} />
                            <Route path="/settings" Component={SettingsPage} />
                            <Route path="*" Component={Page404} />
                        </Routes>
                    </BrowserRouter>
                </AuthAxiosProvider>
            </UserProvider>
        </WebsocketProvider>
    );
};

export default App;
