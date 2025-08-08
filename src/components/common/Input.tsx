import React from 'react';
import { Field } from 'formik';

type InputProps = {
    name: string;
    label: string;
    type: string;
    placeholder?: string;
    as?: 'textarea' | 'input';
    id: string;
    icon?: React.ReactNode;
    errors?: Record<string, string>;
    touched?: Record<string, boolean>;
    classes?: string;
};

export const Input: React.FC<InputProps> = ({ name, label, type, placeholder, id, icon, errors, touched, classes = '', as }) => {
    const showError = errors?.[name] && touched?.[name];

    return (
        <div className={showError ? 'has-error' : ''}>
            <label htmlFor={id}>{label}</label>
            <div className="relative text-white-dark">
                <Field id={id} name={name} type={type} as={as} placeholder={`${placeholder ? placeholder : `Enter ${name}`}`} className={`form-input ${icon && 'ps-10'} ${classes}`} />
                {icon}
            </div>
            {showError && <span className="text-red-500 mt-1 block text-sm">{errors?.[name]}</span>}
        </div>
    );
};
