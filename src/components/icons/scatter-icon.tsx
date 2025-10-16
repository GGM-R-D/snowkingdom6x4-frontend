import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {}

export const ScatterIcon: React.FC<IconProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="10" fill="currentColor" />
    <circle cx="12" cy="12" r="4" fill="#000" />
  </svg>
);
