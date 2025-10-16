import type { SVGProps } from "react";

export function BellIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" {...props}>
      <path
        d="M50 10 C 25 10, 25 40, 25 40 L 20 70 L 80 70 L 75 40 C 75 40, 75 10, 50 10 Z"
        fill="#FFD700"
        stroke="#DAA520"
        strokeWidth="3"
      />
      <path d="M40 70 C 40 85, 60 85, 60 70 Z" fill="#FFD700" />
      <circle cx="50" cy="80" r="8" fill="#F0E68C" />
    </svg>
  );
}
