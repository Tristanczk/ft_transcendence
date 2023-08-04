import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User } from '../types';
import axios from 'axios';
import Button from './Button';

const NavLink: React.FC<{ title: string; current: string; link: string }> = ({
    title,
    current,
    link,
}) => {
    const isActive = current === link;

    return (
        <li>
            <Link
                to={link}
                className={`block py-2 pl-3 pr-4 rounded ${
                    isActive
                        ? 'text-white bg-blue-700 sm:bg-transparent sm:p-0 sm:text-blue-500'
                        : 'sm:p-0 text-white sm:hover:text-blue-500 hover:bg-gray-700 hover:text-white sm:hover:bg-transparent border-gray-700'
                }`}
                aria-current="page"
            >
                {title}
            </Link>
        </li>
    );
};

const DropLink: React.FC<{ text: string; href: string }> = ({ text, href }) => {
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

const Dropdown: React.FC = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    return (
        <div className="flex items-center relative">
            <button
                type="button"
                className="flex mr-3 text-sm bg-gray-800 rounded-full sm:mr-0 focus:ring-4 focus:ring-gray-600"
                aria-expanded="false"
                onClick={() => setDropdownOpen(!dropdownOpen)}
            >
                <img
                    className="w-8 h-8 rounded-full"
                    src="/norminet.jpeg"
                    alt="user"
                />
            </button>
            <div
                className={`z-50 absolute top-full right-0 mt-2 w-48 py-2 rounded-md shadow-xl bg-gray-800 ${
                    dropdownOpen ? 'block' : 'hidden'
                }`}
            >
                <div className="px-4 py-3">
                    <span className="block text-sm text-white">nickname</span>
                    <span className="block text-sm truncate text-gray-400">
                        login if different
                    </span>
                </div>
                <ul className="py-2" aria-labelledby="user-menu-button">
                    <DropLink text="Settings" href="/settings" />
                    <DropLink text="Sign out" href="/signout" />
                </ul>
            </div>
            <button
                data-collapse-toggle="navbar-user"
                type="button"
                className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm rounded-lg sm:hidden focus:outline-none focus:ring-2 text-gray-400 hover:bg-gray-700 focus:ring-gray-600"
                aria-controls="navbar-user"
                aria-expanded="false"
            >
                <svg
                    className="w-5 h-5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 17 14"
                >
                    <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M1 1h15M1 7h15M1 13h15"
                    />
                </svg>
            </button>
        </div>
    );
};

const NavBar: React.FC = () => {
    const location = useLocation();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(
                    'http://localhost:3333/auth/get-user-info',
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
        <nav className="border-gray-200 bg-gray-900">
            <div className="max-w-full flex flex-wrap items-center justify-between mx-auto p-4">
                <Link to="/" className="flex items-center">
                    <img
                        src="/logo512.png"
                        className="w-8 h-8 mr-3"
                        alt="lipong.org logo"
                    />
                    <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">
                        lipong.org
                    </span>
                </Link>
                <div className="sm:order-2">
                    {user ? (
                        <Dropdown />
                    ) : (
                        <Button
                            text="Sign in"
                            onClick={() => {
                                window.location.href = `https://api.intra.42.fr/oauth/authorize?client_id=${process.env.REACT_APP_API42_UID}&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fsignin&response_type=code`;
                            }}
                        ></Button>
                    )}
                </div>
                <div className="items-center justify-between hidden w-full sm:flex sm:w-auto sm:order-1">
                    <ul className="flex flex-col font-medium p-4 sm:p-0 mt-4 border rounded-lg sm:flex-row sm:space-x-8 sm:mt-0 sm:border-0 bg-gray-800 sm:bg-gray-900 border-gray-700">
                        <NavLink
                            current={location.pathname}
                            title="Home"
                            link="/"
                        />
                        <NavLink
                            current={location.pathname}
                            title="Dashboard"
                            link="/dashboard"
                        />
                        {/* TODO /dashboard/:login */}
                        <NavLink
                            current={location.pathname}
                            title="Chat"
                            link="/chat"
                        />
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
