import type { SVGProps } from "react";

export function SevenIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" {...props}>
      <text
        x="50"
        y="80"
        fontFamily="Playfair Display, serif"
        fontSize="90"
        fontWeight="bold"
        fill="#B91C1C"
        textAnchor="middle"
        stroke="#F87171"
        strokeWidth="3"
      >
        7
      </text>
    </svg>
  );
}
