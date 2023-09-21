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
const CORNERS_WIDTH = 240;

const TextNavLink: React.FC<{
    innerDivStyle: string;
    isActive: boolean;
    title: string;
}> = ({ innerDivStyle, isActive, title }) => (
    <div
        className={`${innerDivStyle} ${
            isActive
                ? 'bg-blue-700 bg-transparent p-0 text-rose-600'
                : 'p-0 text-white hover:text-rose-600 hover:bg-gray-700 hover:bg-transparent border-gray-700'
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
    });

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
                    className="flex items-center justify-end space-x-4"
                    style={showLipong && user ? { width: CORNERS_WIDTH } : {}}
                >
                    {gameId &&
                        !gameId?.startsWith('waiting_') &&
                        location.pathname !== `/game/${gameId}` && (
                            <button
                                onClick={handleRejoin}
                                className="w-6 h-6 hover:scale-110"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 57 57"
                                    strokeWidth="2"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path
                                        className="stroke-current text-gray-500"
                                        d="M29,27.528v-12.5c0-2.475,2.025-4.5,4.5-4.5h0c2.475,0,4.5,2.025,4.5,4.5v3.5c0,2.2,1.8,4,4,4h0c2.2,0,4-1.8,4-4v-16"
                                    />
                                    <path
                                        className="fill-current text-gray-300"
                                        d="M45.241,55.471c-1.303,0.022-5.452-0.268-9.314-1.331c-4.514-1.242-10.121-1.237-14.637,0c-3.892,1.066-7.521,1.354-9.314,1.331C5.142,55.383,0,48.52,0,41.499v0c0-7.684,6.287-13.972,13.972-13.972h29.274C50.93,27.528,57,33.815,57,41.499v0C57,48.52,52.075,55.355,45.241,55.471z"
                                    />
                                    <line
                                        className="stroke-current text-gray-500"
                                        x1="27"
                                        y1="31.528"
                                        x2="31.632"
                                        y2="31.528"
                                    />
                                    <circle
                                        className="fill-current text-green-500"
                                        cx="36"
                                        cy="41.528"
                                        r="3"
                                    />
                                    <circle
                                        className="fill-current text-red-500"
                                        cx="50"
                                        cy="41.528"
                                        r="3"
                                    />
                                    <circle
                                        className="fill-current text-yellow-500"
                                        cx="43"
                                        cy="48.528"
                                        r="3"
                                    />
                                    <circle
                                        className="fill-current text-blue-500"
                                        cx="43"
                                        cy="34.528"
                                        r="3"
                                    />
                                    <polygon
                                        className="fill-current text-gray-500"
                                        points="22,38.528 18,38.528 18,34.528 12,34.528 12,38.528 8,38.528 8,44.528 12,44.528 12,48.528 18,48.528 18,44.528 22,44.528"
                                    />
                                </svg>
                            </button>
                        )}
                    {invites.length !== 0 && (
                        <button
                            onClick={() => {
                                setShowInvites((prev) => !prev);
                            }}
                            className="w-5 h-5 hover:scale-110"
                        >
                            <svg
                                viewBox="0 0 512 512"
                                xmlns="http://www.w3.org/2000/svg"
                                xmlnsXlink="http://www.w3.org/1999/xlink"
                            >
                                <g>
                                    <path
                                        fill="#F8CC6D"
                                        d="M453.481,402.747c-28.353-17.478-41.329-72.613-41.329-90.987v-77.245c0-84.141-60.354-154.138-140.122-169.171c2.114-2.739,3.914-5.743,5.283-8.997c2.064-4.853,3.197-10.223,3.197-15.786c0.007-8.359-2.559-16.23-6.932-22.682c-4.373-6.474-10.539-11.592-17.829-14.682C250.89,1.133,245.52,0,239.957,0c-8.352,0-16.223,2.566-22.682,6.939c-6.467,4.366-11.592,10.539-14.682,17.829c-2.058,4.861-3.19,10.223-3.19,15.793c-0.007,8.344,2.566,16.223,6.932,22.682c0.487,0.717,1.004,1.42,1.542,2.101c-79.76,15.04-140.115,85.037-140.115,169.171v77.245c0,18.374-12.976,73.509-41.332,90.987C-62.877,457.789,90.723,512,239.957,512S542.791,457.789,453.481,402.747z M227.34,32.067c1.649-2.438,3.985-4.38,6.703-5.52c1.813-0.767,3.785-1.197,5.914-1.197c3.19,0.007,6.058,0.954,8.495,2.595c2.438,1.642,4.38,3.986,5.528,6.703c0.76,1.807,1.183,3.778,1.183,5.915c-0.007,3.19-0.946,6.05-2.588,8.487c-1.642,2.438-3.986,4.38-6.696,5.528c-1.814,0.76-3.786,1.19-5.922,1.19c-3.19-0.007-6.05-0.946-8.495-2.588c-2.43-1.649-4.373-3.993-5.52-6.71c-0.76-1.807-1.19-3.771-1.19-5.907C224.759,37.364,225.698,34.504,227.34,32.067z"
                                    />
                                    <path
                                        fill="#EBB75A"
                                        d="M476.393,444.247c0,37.414-106.55,67.753-237.999,67.753c-131.44,0-237.988-30.339-237.988-67.753c0-37.414,106.548-67.753,237.988-67.753C369.843,376.494,476.393,406.833,476.393,444.247z"
                                    />
                                    <path
                                        fill="#F7BB62"
                                        d="M254.166,35.084c4.373,11.19-4.854,19.858-14.209,20.367V512c24.016,0,48.046-1.362,71.904-4.043c26.159-2.939,52.211-7.406,77.696-14.073c20.267-5.327,40.59-11.914,59.043-21.972c11.47-6.237,24.754-14.782,29.708-27.543c4.559-11.75-1.771-22.832-10.309-30.812c-6.933-6.481-15.65-10.523-22.475-17.047c-8.129-7.778-14.043-17.693-18.718-27.829c-8.115-17.542-14.66-38.168-14.66-57.645v-72.95c0-38.26-10.882-75.194-33.83-106.092c-25.629-34.532-63.975-58.713-106.264-66.671C292.24,39.156,272.977-0.014,239.957,0v25.665c5.456-0.294,10.969,2.193,13.836,8.559l0.086,0.201c0.036,0.071,0.072,0.143,0.101,0.229c0.036,0.101,0.093,0.186,0.122,0.287C254.144,35.035,254.166,35.084,254.166,35.084z"
                                    />
                                    <g>
                                        <path
                                            fill="#AD7E42"
                                            d="M195.396,397.599c-99.816,4.667-174.91,24.905-174.91,49.193c0,27.658,97.472,50.082,217.908,50.204V396.588C223.684,396.603,209.296,396.94,195.396,397.599z"
                                        />
                                        <path
                                            fill="#9E703B"
                                            d="M288.031,397.829c-15.657-0.824-31.915-1.248-48.633-1.248c-0.33,0-0.667,0.007-1.004,0.007v100.408c0.337,0,0.674,0.007,1.004,0.007c120.91,0,218.923-22.474,218.923-50.21C458.321,422.891,385.535,402.89,288.031,397.829z"
                                        />
                                    </g>
                                    <path
                                        fill="#ECC052"
                                        d="M295.337,424.841c0,29.657-24.044,53.702-53.688,53.702c-29.643,0-53.68-24.044-53.68-53.702c0-9.943,2.71-19.263,7.427-27.242c14.223-0.674,28.941-1.018,44.002-1.018c16.718,0,32.977,0.424,48.633,1.248C292.684,405.757,295.337,414.998,295.337,424.841z"
                                    />
                                    <circle
                                        fill="#FFFFFF"
                                        cx="222.329"
                                        cy="448.799"
                                        r="11.047"
                                    />
                                    <g>
                                        <path
                                            fill="#FFFFFF"
                                            d="M114.499,218.615c0.007-25.005,7.947-48.11,21.474-67.058c13.52-18.933,32.625-33.657,54.834-41.715c5.262-1.914,7.979-7.721,6.072-12.99c-1.915-5.262-7.729-7.972-12.99-6.058c-26.145,9.484-48.54,26.747-64.423,48.984c-15.882,22.224-25.256,49.494-25.248,78.836c0,5.592,4.541,10.13,10.136,10.13C109.957,228.744,114.499,224.206,114.499,218.615z"
                                        />
                                    </g>
                                </g>
                            </svg>
                        </button>
                    )}
                    {user && (
                        <button
                            onClick={() => toggleChatVisibility()}
                            className="w-6 h-6 hover:scale-110"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 512 512"
                            >
                                <circle
                                    fill="#DB2B42"
                                    cx="256"
                                    cy="256"
                                    r="256"
                                />
                                <path
                                    fill="#FFFFFF"
                                    d="M394.768,128.448H117.232C103.352,128.448,92,139.8,92,153.68v176.616  c0,13.88,11.352,25.232,25.232,25.232h132.464l94.616,75.696v-75.696h50.464c13.88,0,25.232-11.352,25.232-25.232V153.68  C420,139.8,408.648,128.448,394.768,128.448z"
                                />
                                <rect
                                    x="135.16"
                                    y="179.752"
                                    width="241.68"
                                    height="16.792"
                                />
                                <rect
                                    x="135.16"
                                    y="232"
                                    width="241.68"
                                    height="16.792"
                                />
                                <rect
                                    x="135.16"
                                    y="284.288"
                                    width="189.896"
                                    height="16.792"
                                />
                            </svg>
                        </button>
                    )}
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
