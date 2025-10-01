import React from 'react';
import { Field } from 'formik';

type InputProps = {
    min?: string | number;
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
    disabled?: boolean;
    value?: string | number;
    onChange?: (e: React.ChangeEvent<any>) => void;
    onBlur?: (e: React.FocusEvent<any>) => void;
};

export const Input: React.FC<InputProps> = ({min = 0, name, label,disabled = false, value, type, placeholder, id, icon, errors, touched, classes = '', as, onChange, onBlur }) => {
    const showError = errors?.[name] && touched?.[name];

    return (
        <div className={showError ? 'has-error' : ''}>
            <label htmlFor={id}>{label}</label>
            <div className="relative text-white-dark">
                <Field min={min} onBlur={onBlur} onChange={onChange} disabled={disabled} value={value} id={id} name={name} type={type} as={as} placeholder={`${placeholder ? placeholder : `Enter ${name}`}`} className={`form-input ${icon && 'ps-10'} ${classes}`} />
                {icon}
            </div>
            {showError && <span className="text-red-500 mt-1 block text-sm">{errors?.[name]}</span>}
        </div>
    );
};
