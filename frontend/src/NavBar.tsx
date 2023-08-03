import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

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
                        ? 'text-white bg-blue-700 md:bg-transparent md:p-0 md:text-blue-500'
                        : 'md:p-0 text-white md:hover:text-blue-500 hover:bg-gray-700 hover:text-white md:hover:bg-transparent border-gray-700'
                }`}
                aria-current="page"
            >
                {title}
            </Link>
        </li>
    );
};

const DropLink: React.FC<{ text: string }> = ({ text }) => {
    return (
        <li>
            <Link
                to="/"
                className="block px-4 py-2 text-sm hover:bg-gray-600 text-gray-200 hover:text-white"
            >
                {text}
            </Link>
        </li>
    );
};

const NavBar: React.FC = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const location = useLocation();

    return (
        <nav className="border-gray-200 bg-gray-900">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <Link to="/" className="flex items-center">
                    <img
                        src="https://notion-emojis.s3-us-west-2.amazonaws.com/prod/svg-twitter/1f3d3.svg"
                        className="w-8 h-8 mr-3"
                        alt="lipong.org logo"
                    />
                    <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">
                        lipong.org
                    </span>
                </Link>
                <div className="flex items-center md:order-2 relative">
                    <button
                        type="button"
                        className="flex mr-3 text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-600"
                        id="user-menu-button"
                        aria-expanded="false"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                        <img
                            className="w-8 h-8 rounded-full"
                            src="https://cdn.intra.42.fr/users/39286e8f2e99c1d912bfed7cfd94bf66/tczarnia.jpg"
                            alt="user"
                        />
                    </button>
                    <div
                        className={`z-50 absolute top-full right-0 mt-2 w-48 py-2 rounded-md shadow-xl bg-gray-800 ${
                            dropdownOpen ? 'block' : 'hidden'
                        }`}
                        id="user-dropdown"
                    >
                        <div className="px-4 py-3">
                            <span className="block text-sm text-white">
                                nickname
                            </span>
                            <span className="block text-sm truncate text-gray-400">
                                login if different
                            </span>
                        </div>
                        <ul className="py-2" aria-labelledby="user-menu-button">
                            <DropLink text="Settings" />
                            <DropLink text="Sign out" />
                        </ul>
                    </div>
                    <button
                        data-collapse-toggle="navbar-user"
                        type="button"
                        className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm rounded-lg md:hidden focus:outline-none focus:ring-2 text-gray-400 hover:bg-gray-700 focus:ring-gray-600"
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
                <div
                    className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
                    id="navbar-user"
                >
                    <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border rounded-lg md:flex-row md:space-x-8 md:mt-0 md:border-0 bg-gray-800 md:bg-gray-900 border-gray-700">
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
