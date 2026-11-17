import React from 'react';

export const HairIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.35" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <circle cx="6" cy="6" r="3" />
    <circle cx="6" cy="18" r="3" />
    <line x1="20" y1="4" x2="8.12" y2="15.88" />
    <line x1="14.47" y1="14.48" x2="20" y2="20" />
    <line x1="8.12" y1="8.12" x2="12" y2="12" />
  </svg>
);

export const SkinIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.35" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    {/* Center petal */}
    <path d="M12 3.5C10.2 6.8 8.8 10 9 14.2c.2 4.2 3 6.3 3 6.3s2.8-2.1 3-6.3c.2-4.2-1.2-7.4-3-10.7z" />
    {/* Left petal */}
    <path d="M9 13.5C6.5 12 3.5 13.5 3.5 16.5c0 2.8 3.2 4 5.5 4" />
    {/* Right petal */}
    <path d="M15 13.5C17.5 12 20.5 13.5 20.5 16.5c0 2.8-3.2 4-5.5 4" />
  </svg>
);

export const NailsIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.35" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    {/* Polish cap */}
    <rect x="9.5" y="2.5" width="5" height="7" rx="0.75" />
    {/* Bottle body */}
    <path d="M6 11.5h12c.8 0 1.5.7 1.5 1.5v6.5c0 1.1-.9 2-2 2H6.5c-1.1 0-2-.9-2-2V13c0-.8.7-1.5 1.5-1.5z" />
    {/* Highlight shine */}
    <line x1="8.5" y1="14.5" x2="8.5" y2="19" strokeWidth="1" opacity="0.6" />
  </svg>
);

export const SpaIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.35" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    {/* Bottom large stone */}
    <ellipse cx="12" cy="18.5" rx="7.5" ry="2.7" />
    {/* Middle stone */}
    <ellipse cx="12" cy="13" rx="5.5" ry="2.2" />
    {/* Top small stone */}
    <ellipse cx="12" cy="8" rx="3.5" ry="1.7" />
  </svg>
);
