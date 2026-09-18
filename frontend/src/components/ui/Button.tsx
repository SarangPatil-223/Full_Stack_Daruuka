import React from 'react';


interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
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
