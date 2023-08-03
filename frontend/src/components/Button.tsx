import React from 'react';

const Button: React.FC<{ text: string; onClick: () => void }> = ({
    text,
    onClick,
}) => (
    <button
        onClick={onClick}
        className="flex items-center justify-center w-1/2 px-5 py-2 text-sm transition-colors duration-200  border rounded-lg gap-x-2 sm:w-auto hover:bg-blue-500 bg-gray-900 text-gray-200 border-gray-700"
    >
        <span>{text}</span>
    </button>
);

export default Button;
