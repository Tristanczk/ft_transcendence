import React from 'react';

interface Props {
    id: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
    required: boolean;
    type: string;
}

const InputField: React.FC<Props> = ({
    onChange,
    id,
    placeholder,
    required,
    type,
}) => (
    <input
        type={type}
        id={id}
        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder={placeholder}
        required={required}
        onChange={onChange}
    ></input>
);

export default InputField;