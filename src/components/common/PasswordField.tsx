import React, { useState } from 'react';
import { Field } from 'formik';
import IconLockDots from '../Icon/IconLockDots';

type InputProps = {
    min?: string | number;
    name: string;
    label: string;
    placeholder?: string;
    id: string;
    errors?: Record<string, string>;
    touched?: Record<string, boolean>;
    classes?: string;
    disabled?: boolean;
    value?: string | number;
    onChange?: (e: React.ChangeEvent<any>) => void;
    onBlur?: (e: React.FocusEvent<any>) => void;
};

export const PasswordField: React.FC<InputProps> = ({ min = 0, name, label, disabled = false, value, placeholder, id, errors, touched, classes = '', onChange, onBlur }) => {
    const showError = errors?.[name] && touched?.[name];
    const [passwordType, setPasswordType] = useState(true);
    const handleIconChange = () => {
        setPasswordType((prevState) => !prevState);
    };

    return (
        <div className={showError ? 'has-error' : ''}>
            <label htmlFor={id}>{label}</label>
            <div className="relative text-white-dark">
                <Field
                    min={min}
                    onBlur={onBlur}
                    onChange={onChange}
                    disabled={disabled}
                    value={value}
                    id={id}
                    name={name}
                    type={passwordType ? 'password' : 'text'}
                    placeholder={`${placeholder ? placeholder : `Enter ${name}`}`}
                    className={`form-input pe-12 ${classes}`}
                />
                <button type='button' className="absolute top-1/2 -translate-y-1/2 right-4 cursor-pointer" onClick={handleIconChange}>
                    <IconLockDots fill={true} />
                </button>
            </div>
            {showError && <span className="text-red-500 mt-1 block text-sm">{errors?.[name]}</span>}
        </div>
    );
};

export default PasswordField;
