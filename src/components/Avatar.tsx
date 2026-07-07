import React from 'react';

interface AvatarProps {
  name: string;
  className?: string;
}

export default function Avatar({ name, className = '' }: AvatarProps) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div
      className={`relative flex items-center justify-center bg-gradient-to-br from-indigo-600 via-violet-600 to-emerald-500 ${className}`}
    >
      <span className="font-bold text-white select-none" style={{ fontSize: '2.5rem' }}>
        {initials}
      </span>
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_30%_20%,white,transparent_50%)] pointer-events-none" />
    </div>
  );
}
