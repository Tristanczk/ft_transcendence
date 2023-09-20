import React from 'react';

const Button: React.FC<{
    disabled?: boolean;
    text: string;
    type?: 'button' | 'submit' | 'reset';
    onClick?: (event: React.FormEvent) => void;
}> = ({ disabled = false, text, type, onClick }) => (
    <button
        disabled={disabled}
        onClick={onClick}
        type={type}
        className={`flex items-center justify-center mr-2 px-5 py-2 text-sm transition-colors duration-200 border rounded-lg gap-x-2 w-auto  bg-gray-900 text-gray-200 border-gray-700 ${
            disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-500'
        }`}
    >
        <span>{text}</span>
    </button>
);

export default Button;
