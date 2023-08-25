import React from 'react';
import axios from 'axios';
import Button from './Button';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import ErrorsFormField from './ErrorsFormField';
import { useNavigate } from 'react-router-dom';

interface TwoFactorInputs {
    validationCode: string;
}

interface Props {
    username: string;
}

const TwoFactorForm: React.FC<Props> = ({ username }) => {
    const [error, setError] = useState<string>();
    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<TwoFactorInputs>({ mode: 'onTouched', criteriaMode: 'all' });
    const navigate = useNavigate();

    const onSubmit = async (data: TwoFactorInputs) => {
        setError(undefined);
        try {
            console.log('username', username);
            console.log('code', data.validationCode);
            await axios.post(
                'http://localhost:3333/auth/authenticate-2fa',
                {
                    nickname: username,
                    code: data.validationCode,
                },
                { withCredentials: true },
            );
            navigate('/');
        } catch (error: any) {
            console.log('error', error.response.data);
            setError(error.response.data);
        }
    };

    return (
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Verify two-factor authentication
            </h1>
            {error && (
                <p className="error mt-2 text-sm font-bold text-red-600 dark:text-red-500">
                    Failed to sign in: {error}
                </p>
            )}
            <form
                className="space-y-4 md:space-y-6"
                onSubmit={handleSubmit(onSubmit)}
            >
                <ErrorsFormField
                    control={control}
                    errors={errors}
                    hasError={!!errors.validationCode}
                    controllerName="validationCode"
                    label="Validation Code"
                    placeholder="000 000"
                    rules={{
                        required: 'Validation code is required',
                        minLength: {
                            value: 6,
                            message:
                                'Validation code must be 6 characters long',
                        },
                        maxLength: {
                            value: 6,
                            message:
                                'Validation code must be 6 characters long',
                        },
                        pattern: {
                            value: /^[0-9]+$/,
                            message: 'Validation code must contain only digits',
                        },
                    }}
                />
                <Button
                    disabled={Object.keys(errors).length > 0}
                    text="Verify two-factor code"
                    type="submit"
                />
            </form>
        </div>
    );
};

export default TwoFactorForm;
