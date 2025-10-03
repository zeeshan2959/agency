import React from 'react';
import Select from 'react-select';
import { useField } from 'formik';

export type OptionType = {
    value: string;
    label: string;
};

export interface SearchableSelectProps {
    id: string;
    name: string;
    label: string;
    disabled?: boolean;
    options: OptionType[];
    onChange?: (option: OptionType | null) => void;
    errors?: Record<string, string>;
    touched?: Record<string, boolean>;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({ id, name, label, options, disabled = false, onChange, errors, touched }) => {
    const [field, , helpers] = useField(name);

    const errorMessage = errors?.[name];
    const isTouched = touched?.[name];
    const hasError = isTouched && !!errorMessage;

    return (
        <div className="flex flex-col">
            <label htmlFor={id} className="mb-1 text-sm font-medium">
                {label}
            </label>
            <Select
                inputId={id}
                options={options}
                value={options.find((opt) => opt.value === field.value) || null}
                isDisabled={disabled}
                onChange={(option) => {
                    helpers.setValue((option as OptionType)?.value || '');
                    if (onChange) onChange(option as OptionType | null);
                }}
                onBlur={() => helpers.setTouched(true)}
                styles={{
                    control: (base, state) => ({
                        ...base,
                        borderColor: hasError ? '#f87171' : base.borderColor,
                        backgroundColor: hasError ? '#e7515a14' : base.backgroundColor,
                        boxShadow: 'none',
                        '&:hover': {
                            borderColor: hasError ? '#f87171' : base.borderColor,
                        },
                        '&:focus': {
                            borderColor: hasError ? '#f87171' : base.borderColor,
                            boxShadow: 'none',
                        },
                        '&:focus-visible': {
                            borderColor: hasError ? '#f87171' : base.borderColor,
                            boxShadow: 'none',
                        },
                    }),
                    placeholder: (base) => ({
                        ...base,
                        color: hasError ? '#f87171' : '#9ca3af',
                        fontWeight: hasError ? 500 : base.fontWeight,
                    }),
                }}
            />
            {hasError && <span className="text-red-500 mt-1 block text-sm">{errorMessage}</span>}
        </div>
    );
};
