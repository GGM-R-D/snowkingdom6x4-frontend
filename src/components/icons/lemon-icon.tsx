import type { SVGProps } from "react";

export function LemonIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" {...props}>
      <ellipse
        cx="50"
        cy="50"
        rx="35"
        ry="25"
        transform="rotate(30 50 50)"
        fill="#FFD700"
      />
      <circle cx="75" cy="30" r="5" fill="#F0E68C" />
      <path d="M25,65 Q35,75 20,80" stroke="#34D399" strokeWidth="4" fill="none" />
    </svg>
  );
}
