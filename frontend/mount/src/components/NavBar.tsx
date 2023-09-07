import React, { ReactNode, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from './Button';
import { useUserContext } from '../context/UserContext';
import { NAVBAR_HEIGHT } from '../constants';
import ImageFriend from './dashboard/friends/ImgFriend';
import OutsideClickHandler from 'react-outside-click-handler';
import { useWindowSize } from 'usehooks-ts';
import { set } from 'date-fns';

const NavLink: React.FC<{
    title: ReactNode;
    current: string;
    link: string;
    icon: string;
}> = ({ title, current, link, icon }) => {
    const innerDivStyle = 'block py-2 pl-3 pr-4 rounded';
    const isActive = current === link;
    const { width } = useWindowSize();
    const showText = width && width >= 768;

    return (
        <li>
            <Link to={link}>
                {showText ? (
                    <div
                        className={`${innerDivStyle} ${
                            isActive
                                ? 'bg-blue-700 bg-transparent p-0 text-blue-500'
                                : 'p-0 text-white hover:text-blue-500 hover:bg-gray-700 hover:bg-transparent border-gray-700'
                        }`}
                    >
                        {title}
                    </div>
                ) : (
                    <div
                        className={`${innerDivStyle} ${
                            isActive ? 'inset shadow-inner bg-indigo-700' : ''
                        }`}
                    >
                        <img
                            src={icon}
                            className="w-6 h-6 mx-1"
                            alt={`${title} icon`}
                        />
                    </div>
                )}
            </Link>
        </li>
    );
};

const NavLinks: React.FC<{ current: string }> = ({ current }) => {
    return (
        <div className="items-center justify-between flex w-auto">
            <ul className="text-xl md:text-base flex font-medium p-0 rounded-lg flex-row space-x-2 md:space-x-8 mt-0 border-0 bg-gray-900 border-gray-700">
                <NavLink
                    current={current}
                    title="Home"
                    link="/"
                    icon="/favicon.ico"
                />
                <NavLink
                    current={current}
                    title="Dashboard"
                    link="/dashboard"
                    icon="/navlinks/pie-chart.svg"
                />
                <NavLink
                    current={current}
                    title="Leaderboard"
                    link="/leaderboad"
                    icon="/navlinks/podium.png"
                />
                <NavLink
                    current={current}
                    title="Chat"
                    link="/chat"
                    icon="/navlinks/postcard.svg"
                />
            </ul>
        </div>
    );
};

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

function UserMenu() {
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
                    className="flex items-center relative"
                    onClick={() => {
                        setShowInfo(true);
                    }}
                >
                    <button
                        type="button"
                        className="flex mr-3 text-sm bg-gray-800 rounded-full md:mr-0 active:ring-4 active:ring-gray-600"
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
                                {/* <span className="block text-sm truncate text-gray-400">
                                    login if different
                                </span> */}
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
}

const NavBar: React.FC<{
    gameId: string | undefined;
    setGameId: (gameId: string | undefined) => void;
}> = ({ gameId, setGameId }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useUserContext();

    useEffect(() => {
        console.log(location.pathname);
    });

    useEffect(() => {
        setGameId(undefined);
    }, [user]);
    //TO DO: add useeffect to get gameId if necessary

    const handleRejoin = () => {
        //TO DO: check if game is still available, if yes redirect, if no error message
        navigate(`/game/${gameId}`);
    };

    return (
        <nav
            className="border-gray-200 bg-gray-900"
            style={{ height: NAVBAR_HEIGHT }}
        >
            <div className="max-w-full flex flex-wrap items-center justify-between mx-auto p-4">
                <Link to="/" className="hidden md:flex items-center">
                    <img
                        src="/logo192.png"
                        className="w-8 h-8 mr-3"
                        alt="lipong.org logo"
                    />
                    <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">
                        lipong.org
                    </span>
                </Link>
                <NavLinks current={location.pathname} />
                <div className="flex items-center">
                    {gameId && location.pathname !== `/game/${gameId}` && (
                        <Button text="Rejoin game" onClick={handleRejoin} />
                    )}
                    {user ? (
                        <UserMenu />
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
