import React from 'react';

export default function Loading() {
  return (
    <div className="p-2 md:p-5 flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
      <div className="w-12 h-12 border-4 border-[#1c1c1e] border-t-[#1A5FA4] rounded-full animate-spin"></div>
      <p className="mt-4 text-[#ABABAB] font-medium text-lg tracking-wide">
        Loading Subjects...
      </p>
    </div>
  );
}
