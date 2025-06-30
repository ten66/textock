import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  showPasswordToggle?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    label, 
    error, 
    helper, 
    className = '', 
    type,
    showPasswordToggle = false,
    ...props 
  }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const inputType = showPasswordToggle && type === 'password' 
      ? (showPassword ? 'text' : 'password') 
      : type;

    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            type={inputType}
            className={`w-full px-4 py-3 border-2 rounded-xl shadow-sm transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 placeholder:text-gray-400 dark:placeholder:text-gray-500 ${
              error 
                ? 'border-red-300 bg-red-50 dark:bg-red-900/20 focus:border-red-500 focus:ring-red-500/20' 
                : isFocused
                ? 'border-blue-500 bg-white dark:bg-gray-800 shadow-lg'
                : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-white dark:hover:bg-gray-600 hover:shadow-md'
            } ${showPasswordToggle ? 'pr-12' : ''} dark:text-gray-100 ${className}`}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />
          {showPasswordToggle && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>
        {error && (
          <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg border border-red-200 dark:border-red-800">
            <div className="w-1 h-1 bg-red-500 rounded-full"></div>
            {error}
          </div>
        )}
        {helper && !error && (
          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            {helper}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';