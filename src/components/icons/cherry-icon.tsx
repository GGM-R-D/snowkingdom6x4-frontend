import type { SVGProps } from "react";

export function CherryIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" {...props}>
      <path
        d="M60,20 Q70,10 80,20"
        stroke="#34D399"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M60,20 Q50,10 40,20"
        stroke="#34D399"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="40" cy="45" r="20" fill="#DC2626" />
      <circle cx="80" cy="45" r="20" fill="#DC2626" />
      <circle cx="35" cy="38" r="5" fill="white" fillOpacity="0.7" />
      <circle cx="75" cy="38" r="5" fill="white" fillOpacity="0.7" />
    </svg>
  );
}
