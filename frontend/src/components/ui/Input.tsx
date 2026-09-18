import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  required?: boolean;
}

export const Input: React.FC<InputProps> = ({ label, error, id, required, ...props }) => {
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="field">
      <label
        htmlFor={inputId}
        className={`field__label${required ? ' field__label--required' : ''}`}
      >
        {label}
      </label>
      <input
        id={inputId}
        className="field__input"
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        required={required}
        {...props}
      />
      {error && (
        <span id={`${inputId}-error`} className="field__error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
};
