import React from 'react';
import { useField } from 'formik';

type InputProps = {
    min?: string | number;
    name: string;
    label: string;
    type?: string;
    placeholder?: string;
    as?: 'textarea' | 'input';
    id: string;
    icon?: React.ReactNode;
    classes?: string;
    disabled?: boolean;
};

export const Input: React.FC<InputProps> = ({
    min = 0,
    name,
    label,
    disabled = false,
    type = 'text',
    placeholder,
    id,
    icon,
    classes = '',
    as = 'input',
}) => {
    const [field, meta] = useField(name);
    const showError = meta.touched && meta.error;

    return (
        <div className={showError ? 'has-error' : ''}>
            <label htmlFor={id}>{label}</label>
            <div className="relative text-white-dark">
                {as === 'textarea' ? (
                    <textarea
                        {...field}
                        id={id}
                        disabled={disabled}
                        placeholder={placeholder || `Enter ${label}`}
                        className={`form-textarea ${icon ? 'ps-10' : ''} ${classes}`}
                    />
                ) : (
                    <input
                        {...field}
                        id={id}
                        type={type}
                        min={min}
                        disabled={disabled}
                        placeholder={placeholder || `Enter ${label}`}
                        className={`form-input ${icon ? 'ps-10' : ''} ${classes}`}
                    />
                )}
                {icon}
            </div>
            {showError && <span className="text-red-500 mt-1 block text-sm">{meta.error}</span>}
        </div>
    );
};
