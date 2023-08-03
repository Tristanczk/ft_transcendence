import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

const NavLink: React.FC<{ title: string; current: string; link: string }> = ({
    title,
    current,
    link,
}) => {
    const isActive = current === link;
    return (
        <li>
            <a
                href={link}
                className={`block py-2 pl-3 pr-4 rounded ${
                    isActive
                        ? 'text-white bg-blue-700 md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500'
                        : 'text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700'
                }`}
                aria-current="page"
            >
                {title}
            </a>
        </li>
    );
};

const NavBar: React.FC = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const location = useLocation();
    console.log(location.pathname);

    return (
        <nav className="bg-white border-gray-200 dark:bg-gray-900">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <a href="/" className="flex items-center">
                    <img
                        src="https://notion-emojis.s3-us-west-2.amazonaws.com/prod/svg-twitter/1f3d3.svg"
                        className="h-8 mr-3"
                        alt="lipong.org logo"
                    />
                    <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                        lipong.org
                    </span>
                </a>
                <div className="flex items-center md:order-2 relative">
                    <button
                        type="button"
                        className="flex mr-3 text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                        id="user-menu-button"
                        aria-expanded="false"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                        <span className="sr-only">Open user menu</span>
                        <img
                            className="w-8 h-8 rounded-full"
                            src="https://cdn.intra.42.fr/users/39286e8f2e99c1d912bfed7cfd94bf66/tczarnia.jpg"
                            alt="user"
                        />
                    </button>
                    <div
                        className={`z-50 absolute top-full right-0 mt-2 w-48 py-2 bg-white rounded-md shadow-xl dark:bg-gray-800 ${
                            dropdownOpen ? 'block' : 'hidden'
                        }`}
                        id="user-dropdown"
                    >
                        <div className="px-4 py-3">
                            <span className="block text-sm text-gray-900 dark:text-white">
                                Bonnie Green
                            </span>
                            <span className="block text-sm  text-gray-500 truncate dark:text-gray-400">
                                name@flowbite.com
                            </span>
                        </div>
                        <ul className="py-2" aria-labelledby="user-menu-button">
                            <li>
                                <a
                                    href="/"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                                >
                                    Dashboard
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                                >
                                    Settings
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                                >
                                    Earnings
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                                >
                                    Sign out
                                </a>
                            </li>
                        </ul>
                    </div>
                    <button
                        data-collapse-toggle="navbar-user"
                        type="button"
                        className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                        aria-controls="navbar-user"
                        aria-expanded="false"
                    >
                        <span className="sr-only">Open main menu</span>
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
                    <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
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
