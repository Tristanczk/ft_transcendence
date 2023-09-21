import React from 'react';

interface Props {
    autocomplete?: string;
    hasError?: boolean;
    id: string;
    minLength?: number;
    placeholder: string;
    required?: boolean;
    type: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: React.FocusEventHandler<HTMLInputElement>;
}

const InputField: React.FC<Props> = React.forwardRef<HTMLInputElement, Props>(
    (
        {
            autocomplete,
            hasError = false,
            id,
            minLength,
            placeholder,
            required = false,
            type,
            onChange,
            onBlur,
        },
        ref,
    ) => (
        <input
            ref={ref}
            autoComplete={autocomplete}
            className={`bg-gray-50 border ${
                hasError ? 'border-red-500' : 'border-gray-300'
            } text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-600 dark:focus:border-blue-600 $`}
            id={id}
            minLength={minLength}
            placeholder={placeholder}
            type={type}
            required={required}
            onChange={onChange}
            onBlur={onBlur}
        ></input>
    ),
);

export default InputField;
