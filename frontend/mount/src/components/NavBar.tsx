import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from './Button';
import { useUserContext } from '../context/UserContext';
import ImageFriend from './dashboard/friends/ImgFriend';
import OutsideClickHandler from 'react-outside-click-handler';
import { useWindowSize } from 'usehooks-ts';
import { NAVBAR_HEIGHT } from '../shared/misc';
import axios from 'axios';
import { WebsocketContext } from '../context/WebsocketContext';
import InvitesMenu from './user/InvitesMenu';
import { Invite } from '../shared/game_info';

const NAVBAR_BREAKPOINT = 1024;
const CORNERS_WIDTH = 256

const TextNavLink: React.FC<{
    innerDivStyle: string;
    isActive: boolean;
    title: string;
}> = ({ innerDivStyle, isActive, title }) => (
    <div
        className={`${innerDivStyle} ${
            isActive
                ? 'bg-blue-700 bg-transparent p-0 text-blue-500'
                : 'p-0 text-white hover:text-blue-500 hover:bg-gray-700 hover:bg-transparent border-gray-700'
        }`}
    >
        {title}
    </div>
);

const ImgNavLink: React.FC<{
    innerDivStyle: string;
    isActive: boolean;
    icon: string;
    title: string;
}> = ({ innerDivStyle, isActive, icon, title }) => (
    <div
        className={`${innerDivStyle} ${
            isActive ? 'inset shadow-inner bg-indigo-700' : ''
        }`}
    >
        <img src={icon} className="w-6 h-6 mx-1" alt={`${title} icon`} />
    </div>
);

const NavLink: React.FC<{
    title: string;
    current: string;
    link: string;
    icon: string;
    showLipong: boolean;
}> = ({ title, current, link, icon, showLipong }) => {
    const innerDivStyle = 'block py-2 px-2 mb:px-4 rounded';
    const isActive = current === link;

    return (
        <li>
            <Link to={link}>
                {showLipong ? (
                    <TextNavLink
                        innerDivStyle={innerDivStyle}
                        isActive={isActive}
                        title={title}
                    />
                ) : (
                    <ImgNavLink
                        innerDivStyle={innerDivStyle}
                        isActive={isActive}
                        icon={icon}
                        title={title}
                    />
                )}
            </Link>
        </li>
    );
};

const NavLinks: React.FC<{
    current: string;
    toggleChatVisibility: () => void;
    showLipong: boolean;
}> = ({ current, toggleChatVisibility, showLipong }) => (
    <div className="items-center justify-between flex w-auto">
        <ul className="text-xl lg:text-base flex font-medium p-0 rounded-lg flex-row space-x-2 lg:space-x-8 mt-0 border-0 bg-gray-900 border-gray-700">
            <NavLink
                current={current}
                showLipong={showLipong}
                title="Home"
                link="/"
                icon="/favicon.ico"
            />
            <NavLink
                current={current}
                showLipong={showLipong}
                title="Dashboard"
                link="/dashboard"
                icon="/navlinks/pie-chart.svg"
            />
            <NavLink
                current={current}
                showLipong={showLipong}
                title="Leaderboard"
                link="/leaderboard"
                icon="/navlinks/podium.png"
            />
        </ul>
    </div>
);

const MenuLink: React.FC<{
    text: string;
    href: string;
    onClick: () => void;
}> = ({ text, href, onClick }) => {
    return (
        <li>
            <Link
                to={href}
                className="block px-4 py-2 text-sm hover:bg-gray-600 text-gray-200 hover:text-white"
                onClick={onClick}
            >
                {text}
            </Link>
        </li>
    );
};

const UserMenu: React.FC<{ showLipong: boolean }> = ({ showLipong }) => {
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [showInfo, setShowInfo] = useState<boolean>(true);
    const { user } = useUserContext();

    return (
        <div
            onClick={() => {
                setShowInfo(true);
            }}
        >
            <OutsideClickHandler
                onOutsideClick={() => {
                    setShowInfo(false);
                    setUserMenuOpen(false);
                }}
            >
                <div
                    className="flex items-center relative justify-end"
                    onClick={() => {
                        setShowInfo(true);
                    }}
                >
                    <button
                        type="button"
                        className="flex mr-3 text-sm bg-gray-800 rounded-full lg:mr-0 active:ring-4 active:ring-gray-600"
                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                    >
                        {user && (
                            <ImageFriend
                                userId={user.id}
                                textImg={user.nickname}
                                size={8}
                            />
                        )}
                    </button>

                    {showInfo && (
                        <div
                            className={`z-50 absolute top-full right-0 mt-2 w-48 py-2 rounded-md shadow-xl bg-gray-800 ${
                                userMenuOpen ? 'block' : 'hidden'
                            }`}
                            onClick={() => {
                                setShowInfo(true);
                            }}
                        >
                            <div className="px-4 py-3">
                                <span className="block text-sm text-white">
                                    {user?.nickname}
                                </span>
                            </div>
                            <ul className="py-2">
                                <MenuLink
                                    text="Settings"
                                    href="/settings"
                                    onClick={() =>
                                        setUserMenuOpen(!userMenuOpen)
                                    }
                                />
                                <MenuLink
                                    text="Sign out"
                                    href="/signout"
                                    onClick={() =>
                                        setUserMenuOpen(!userMenuOpen)
                                    }
                                />
                            </ul>
                        </div>
                    )}
                </div>
            </OutsideClickHandler>
        </div>
    );
};

const NavBar = ({
    gameId,
    setGameId,
    toggleChatVisibility,
}: {
    gameId: string | undefined;
    setGameId: (gameId: string | undefined) => void;
    toggleChatVisibility: () => void;
}) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useUserContext();
    const [isLoading, setIsLoading] = useState(true);
    const socket = useContext(WebsocketContext);
    const { width } = useWindowSize();
    const [showInvites, setShowInvites] = useState(false);
    const showLipong = !!(!user || (width && width >= NAVBAR_BREAKPOINT));
    const [invites, setInvites] = useState<Invite[]>([]);

    useEffect(() => {
        const getGameStatus = async () => {
            const response = await axios.get(
                `http://${process.env.REACT_APP_SERVER_ADDRESS}:3333/gate/gameStatus/${user?.id}`,
                { withCredentials: true },
            );
            if (response.data.status === 'playing') {
                setGameId(response.data.gameId);
            } else if (response.data.status === 'finished') {
                setGameId(undefined);
            }
            setIsLoading(false);
        };
        const getGameInvites = async () => {
            const response = await axios.get(
                `http://${process.env.REACT_APP_SERVER_ADDRESS}:3333/gate/gameInvites/${user?.id}`,
                { withCredentials: true },
            );
            for (const invite of response.data.invites) {
                if (!invites.includes(invite))
                    setInvites((oldInvites) => [...oldInvites, invite]);
            }
            setIsLoading(false);
        };

        if (user) {
            getGameStatus();
            getGameInvites();
        } else {
            setIsLoading(false);
            setInvites([]);
            setGameId(undefined);
        }
    }, [user, setGameId, isLoading]);

    useEffect(() => {
        socket.on('endGame', (data: { message: string }) => {
            if (data.message === 'game ended') {
                setGameId(undefined);
            }
        });
        socket.on('inviteGame', (data: Invite) => {
            if (!invites.includes(data))
                setInvites((oldInvites) => [...oldInvites, data]);
        });

        socket.on('uninviteGame', (data: Invite) => {
            setInvites((oldInvites) =>
                oldInvites.filter((invite) => invite.gameId !== data.gameId),
            );
        });

        return () => {
            socket.off('endGame');
            socket.off('inviteGame');
        };
    }, [socket]);

    const handleRejoin = () => {
        navigate(`/game/${gameId}`);
    };

    return (
        <nav
            className="sticky top-0 border-gray-200 bg-gray-900 z-50"
            style={{ height: NAVBAR_HEIGHT }}
        >
            <div className="max-w-full flex flex-wrap items-center justify-between mx-auto p-4">
                <Link
                    to="/"
                    className="items-center"
                    style={
                        showLipong
                            ? { display: 'flex', width: CORNERS_WIDTH }
                            : { display: 'none' }
                    }
                >
                    <img
                        src="/logo192.png"
                        className="w-8 h-8 mr-3"
                        alt="lipong.org logo"
                    />
                    <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">
                        lipong.org
                    </span>
                </Link>
                {user && (
                    <NavLinks
                        current={location.pathname}
                        toggleChatVisibility={toggleChatVisibility}
                        showLipong={showLipong}
                    />
                )}
                <div
                    className="flex items-center justify-end space-x-2"
                    style={showLipong ? { width: CORNERS_WIDTH } : {}}
                >
                    {gameId &&
                        !gameId.startsWith('waiting_') &&
                        location.pathname !== `/game/${gameId}` && (
                            <Button text="Rejoin game" onClick={handleRejoin} />
                        )}
                    {invites.length !== 0 && (
                        <Button
                            text="Invites"
                            onClick={() => {
                                setShowInvites((prev) => !prev);
                            }}
                        />
                    )}
                    <Button
                        text="Chat"
                        onClick={() => toggleChatVisibility()}
                    />
                    {showInvites && (
                        <InvitesMenu
                            setShowInvites={setShowInvites}
                            setGameId={setGameId}
                            invites={invites}
                            setInvites={setInvites}
                        />
                    )}
                    {user ? (
                        <UserMenu showLipong={showLipong} />
                    ) : (
                        <Button
                            text="Sign in"
                            onClick={() => {
                                navigate('/signin');
                            }}
                        />
                    )}
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
