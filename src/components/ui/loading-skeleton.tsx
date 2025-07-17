
import React from 'react';

export const CalendarSkeleton = () => (
  <div className="space-y-3 animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
    <div className="grid grid-cols-7 gap-2">
      {Array.from({ length: 35 }).map((_, i) => (
        <div key={i} className="h-8 bg-gray-200 rounded"></div>
      ))}
    </div>
  </div>
);

export const TimeSlotskeleton = () => (
  <div className="space-y-2 animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    <div className="grid grid-cols-2 gap-2">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="h-7 bg-gray-200 rounded"></div>
      ))}
    </div>
  </div>
);

export const FormSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="space-y-2">
        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
        <div className="h-8 bg-gray-200 rounded"></div>
      </div>
    ))}
  </div>
);
