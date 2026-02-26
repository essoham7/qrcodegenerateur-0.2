import React from 'react';
import { motion } from 'framer-motion';

const Input = ({ 
  type = 'text',
  placeholder = '',
  value,
  onChange,
  className = '',
  disabled = false,
  size = 'md',
  variant = 'default',
  label,
  error,
  id,
  name,
  required = false,
  ...props 
}) => {
  const baseClasses = 'w-full rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    default: 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 bg-white text-gray-900',
    error: 'border-red-300 focus:border-red-500 focus:ring-red-500 bg-red-50 text-red-900',
    success: 'border-green-300 focus:border-green-500 focus:ring-green-500 bg-green-50 text-green-900'
  };
  
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-5 py-3 text-lg'
  };
  
  const inputVariant = error ? 'error' : variant;
  const classes = `${baseClasses} ${variants[inputVariant]} ${sizes[size]} ${className}`;
  
  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={id} 
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <motion.input
        whileFocus={{ scale: 1.01 }}
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={classes}
        {...props}
      />
      
      {error && (
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-red-600"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

export default Input;