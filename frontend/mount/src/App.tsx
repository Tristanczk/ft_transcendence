import React, { useEffect, useState } from 'react';
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
import { UserProvider, useUserContext } from './context/UserContext';
import UserPage from './pages/UserPage';
import LeaderboardPage from './pages/LeaderboardPage';
import { AuthAxiosProvider } from './context/AuthAxiosContext';
import AchievementPage from './pages/AchievementsPage';
import GameHistoryPage from './pages/GameHistoryPage';
import GamePage from './pages/GamePage';
import LocalClassic from './games/local/LocalClassic';
import LocalMayhem from './games/local/LocalMayhem';
import LocalBattleRoyale from './games/local/LocalBattleRoyale';

const App: React.FC = () => {
    const { user } = useUserContext();
    const [gameId, setGameId] = useState<string | undefined>(undefined);

    useEffect(() => {
        setGameId(undefined);
    }, [user]);

    return (
        <WebsocketProvider value={socket}>
            <UserProvider>
                <AuthAxiosProvider>
                    <TrackingOnline />
                    <BrowserRouter>
                        <NavBar gameId={gameId} />
                        <Routes>
                            <Route
                                path="/"
                                element={
                                    <HomePage
                                        gameId={gameId}
                                        setGameId={setGameId}
                                    />
                                }
                            />
                            <Route
                                path="/local/battle"
                                Component={LocalBattleRoyale}
                            />
                            <Route
                                path="/local/classic"
                                Component={LocalClassic}
                            />
                            <Route
                                path="/local/mayhem"
                                Component={LocalMayhem}
                            />
                            <Route path="/game/:gameId" Component={GamePage} />
                            <Route
                                path="/dashboard"
                                Component={DashboardPage}
                            />
                            <Route
                                path="/achievements"
                                Component={AchievementPage}
                            />
                            <Route
                                path="/games/:idUserToView"
                                Component={GameHistoryPage}
                            />
                            <Route
                                path="/dashboard/:idUserToView"
                                Component={UserPage}
                            />
                            <Route
                                path="/leaderboad"
                                Component={LeaderboardPage}
                            />
                            <Route path="/chat" Component={ChatPage} />
                            <Route path="/signin" Component={SignInPage} />
                            <Route path="/signup" Component={SignUpPage} />
                            <Route path="/signin42" Component={SignInPage42} />
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
