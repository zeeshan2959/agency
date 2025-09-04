import React from 'react';

type ButtonProps = {
    type?: 'submit' | 'button' | 'reset' | undefined;
    text: string;
    classes?: string;
    handleClick?: () => void;
    disabled?: boolean;
};

export const Button = ({ type = 'submit', text, classes = 'btn btn-primary', handleClick, disabled }: ButtonProps) => {
    return (
        <button type={type} className={classes} disabled={disabled}>
            {text}
        </button>
    );
};
