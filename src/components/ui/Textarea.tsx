import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helper?: string;
}

export function Textarea({ 
  label, 
  error, 
  helper, 
  className = '', 
  ...props 
}: TextareaProps) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <textarea
        className={`w-full px-3 py-2 border rounded-lg shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder:text-gray-400 ${
          error 
            ? 'border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-700' 
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 focus:border-blue-500'
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
      {helper && !error && (
        <p className="text-sm text-gray-500 dark:text-gray-400">{helper}</p>
      )}
    </div>
  );
}