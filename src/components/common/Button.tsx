import React from 'react';

type ButtonProps = {
    type?: 'submit' | 'button' | 'reset' | undefined;
    text: string;
    classes?: string;
    handleClick?: () => void;
};

export const Button = ({ type = 'submit', text, classes = 'btn btn-primary', handleClick }: ButtonProps) => {
    return (
        <button type={type} className={classes}>
            {text}
        </button>
    );
};
