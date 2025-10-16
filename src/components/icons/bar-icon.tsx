import type { SVGProps } from "react";

export function BarIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" {...props}>
      <rect x="5" y="25" width="90" height="50" rx="10" fill="#FFD700" />
      <text
        x="50"
        y="60"
        fontFamily="Arial, sans-serif"
        fontSize="30"
        fontWeight="bold"
        fill="#8B0000"
        textAnchor="middle"
      >
        BAR
      </text>
    </svg>
  );
}
