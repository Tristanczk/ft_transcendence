import React from 'react';

interface Props {
    autocomplete?: string;
    id: string;
    placeholder: string;
    required: boolean;
    type: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<Props> = ({
    autocomplete,
    id,
    placeholder,
    required,
    type,
    onChange,
}) => (
    <input
        type={type}
        id={id}
        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder={placeholder}
        required={required}
        autoComplete={autocomplete}
        onChange={onChange}
    ></input>
);

export default InputField;
