import React from 'react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading,
  className = '',
  ...props
}) => {
  const sizeClass = size === 'sm' ? 'btn--sm' : '';
  return (
    <button
      className={`btn btn--${variant} ${sizeClass} ${className}`.trim()}
      aria-disabled={isLoading || props.disabled}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="sr-only">Loading</span>
          <span aria-hidden="true">···</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};
