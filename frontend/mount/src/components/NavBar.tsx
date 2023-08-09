import React, { ReactNode, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User } from '../types';
import axios from 'axios';
import Button from './Button';
import { useWidth } from '../hooks';

const NavLink: React.FC<{
    title: ReactNode;
    current: string;
    link: string;
    icon: string;
}> = ({ title, current, link, icon }) => {
    const innerDivStyle = 'block py-2 pl-3 pr-4 rounded';
    const isActive = current === link;
    const width = useWidth();
    const showText = width && width >= 640;

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
            <ul className="text-xl sm:text-base flex font-medium p-0 rounded-lg flex-row space-x-2 sm:space-x-8 mt-0 border-0 bg-gray-900 border-gray-700">
                <NavLink
                    current={current}
                    title="Home"
                    link="/"
                    icon="/favicon.ico"
                />
                <NavLink
                    current={current}
                    title="Dashboard"
                    link="/dashboard" // TODO /dashboard/:login
                    icon="/pie-chart.svg"
                />
                <NavLink
                    current={current}
                    title="Chat"
                    link="/chat"
                    icon="/postcard.svg"
                />
            </ul>
        </div>
    );
};

const MenuLink: React.FC<{ text: string; href: string }> = ({ text, href }) => {
    return (
        <li>
            <Link
                to={href}
                className="block px-4 py-2 text-sm hover:bg-gray-600 text-gray-200 hover:text-white"
            >
                {text}
            </Link>
        </li>
    );
};

const UserMenu: React.FC = () => {
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    return (
        <div className="flex items-center relative">
            <button
                type="button"
                className="flex mr-3 text-sm bg-gray-800 rounded-full sm:mr-0 active:ring-4 active:ring-gray-600"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
            >
                <img
                    className="w-8 h-8 rounded-full"
                    src="/norminet.jpeg"
                    alt="user"
                />
            </button>
            <div
                className={`z-50 absolute top-full right-0 mt-2 w-48 py-2 rounded-md shadow-xl bg-gray-800 ${
                    userMenuOpen ? 'block' : 'hidden'
                }`}
            >
                <div className="px-4 py-3">
                    <span className="block text-sm text-white">nickname</span>
                    <span className="block text-sm truncate text-gray-400">
                        login if different
                    </span>
                </div>
                <ul className="py-2">
                    <MenuLink text="Settings" href="/settings" />
                    <MenuLink text="Sign out" href="/signout" />
                </ul>
            </div>
        </div>
    );
};

const NavBar: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(
                    'http://localhost:3333/users/me',
                    { withCredentials: true },
                );
                setUser(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchUser();
    }, []);

    return (
        <nav className="border-gray-200 bg-gray-900" style={{ height: 72 }}>
            <div className="max-w-full flex flex-wrap items-center justify-between mx-auto p-4">
                <Link to="/" className="hidden sm:flex items-center">
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
                <div className="flex items-center relative">
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
