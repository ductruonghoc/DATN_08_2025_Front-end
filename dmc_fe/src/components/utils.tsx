import React, { FC, ChangeEvent, MouseEvent, ReactNode } from 'react';
// --- UI Component Mocks (Styled HTML elements with Types) ---

interface LabelProps {
  htmlFor: string;
  children: ReactNode;
  className?: string;
}
export const Label: FC<LabelProps> = ({ htmlFor, children, className }) => (
  <label htmlFor={htmlFor} className={`block text-sm font-medium text-gray-700 mb-1 ${className || ''}`}>
    {children}
  </label>
);

interface InputProps {
  id: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  name: string;
  className?: string;
}
export const Input: FC<InputProps> = ({ id, type = "text", placeholder, value, onChange, name, className }) => (
  <input
    type={type}
    id={id}
    name={name}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className={`mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${className || ''}`}
  />
);

interface SelectProps {
  id: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  name: string;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}
export const Select: FC<SelectProps> = ({ id, value, onChange, name, children, className, disabled }) => (
  <select
    id={id}
    name={name}
    value={value}
    onChange={onChange}
    disabled={disabled}
    className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white disabled:bg-gray-100 disabled:cursor-not-allowed ${className || ''}`}
  >
    {children}
  </select>
);

interface ButtonProps {
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  children: ReactNode;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}
export const Button: FC<ButtonProps> = ({ onClick, children, variant = 'default', size = 'default', className, disabled, type = "button" }) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";
  
  const variantStyles = {
    default: "bg-indigo-600 text-white hover:bg-indigo-700",
    destructive: "bg-red-500 text-white hover:bg-red-600",
    outline: "border border-gray-300 hover:bg-gray-100 hover:text-gray-800",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    ghost: "hover:bg-gray-100 hover:text-gray-800",
    link: "underline-offset-4 hover:underline text-indigo-600",
  };

  const sizeStyles = {
    default: "h-10 py-2 px-4",
    sm: "h-9 px-3 rounded-md",
    lg: "h-11 px-8 rounded-md",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className || ''}`}
    >
      {children}
    </button>
  );
};

export const Spinner = () => (
    <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
        <span className="ml-3 text-indigo-600">Loading...</span>
    </div>
);


interface PercentageBarProps {
  progress: number;
  className?: string; // Optional className for additional styling
}

export const PercentageBar= ({ progress, className = '' } : PercentageBarProps) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100); // Ensure progress is between 0 and 100

  return (
    <div className={`w-full max-w-xs ${className}`}>
      <div className="bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-150 ease-linear" // Use ease-linear for smoother updates if progress updates frequently
          style={{ width: `${clampedProgress}%` }}
        ></div>
      </div>
      <p className="text-center text-xs text-gray-700 dark:text-gray-300 mt-1">{clampedProgress}%</p>
    </div>
  );
};