import React from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Desktop Layout */}
      <div className="hidden sm:flex min-h-screen items-center justify-center p-4">
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 transition-opacity"
          onClick={onClose}
        />
        <div className={`relative bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-hidden border border-gray-200 dark:border-gray-700`}>
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
            <Button
              variant="ghost"
              size="sm"
              icon={X}
              onClick={onClose}
              className="p-1"
            />
          </div>
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            {children}
          </div>
        </div>
      </div>

      {/* Mobile Layout - Full Screen */}
      <div className="sm:hidden fixed inset-0 bg-white dark:bg-gray-800">
        <div 
          className="absolute inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 transition-opacity"
          onClick={onClose}
        />
        <div className="relative h-full flex flex-col bg-white dark:bg-gray-800">
          {/* Mobile Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate pr-4">{title}</h2>
            <Button
              variant="ghost"
              size="sm"
              icon={X}
              onClick={onClose}
              className="p-2 flex-shrink-0"
            />
          </div>
          
          {/* Mobile Content */}
          <div className="flex-1 overflow-y-auto p-4 bg-white dark:bg-gray-800">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}