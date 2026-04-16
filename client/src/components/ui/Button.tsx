import React from 'react';

interface ButtonProps {
    label: string;
    onClick: () => void;
    disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ label, onClick, disabled }) => {
    return (
        <button 
            className={`bg-blue-500 text-white font-semibold py-2 px-4 rounded ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`} 
            onClick={onClick} 
            disabled={disabled}
        >
            {label}
        </button>
    );
};

export default Button;