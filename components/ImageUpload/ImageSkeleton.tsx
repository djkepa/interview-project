import React from 'react';

export const ImageSkeleton = () => {
  return (
    <div className="mt-2 animate-pulse">
      <p className="mb-1 h-4 w-16 rounded bg-gray-600"></p>
      <div className="h-40 w-full rounded-lg bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700"></div>
    </div>
  );
};
