import React from 'react';

export const Select = ({ label, error, id, options, ...props }) => {
  const selectId = id || label.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="field">
      <label htmlFor={selectId} className="field__label">
        {label}
      </label>
      <select id={selectId} className="field__select" aria-invalid={!!error} {...props}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <span className="field__error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
};
