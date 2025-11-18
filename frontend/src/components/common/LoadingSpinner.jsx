import React from 'react';

const LoadingSpinner = ({ size = 'large', className = '' }) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12',
  };

  return (
    <div className={`flex items-center justify-center min-h-screen ${className}`}>
      <div className={`spinner ${sizeClasses[size]} text-primary-600`}></div>
    </div>
  );
};

export default LoadingSpinner;
