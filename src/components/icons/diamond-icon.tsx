import type { SVGProps } from "react";

export function DiamondIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" {...props}>
      <polygon
        points="50,10 90,40 50,90 10,40"
        fill="#00BFFF"
        stroke="#87CEEB"
        strokeWidth="3"
      />
      <polygon points="50,10 70,40 50,40" fill="#ADD8E6" />
      <polygon points="50,10 30,40 50,40" fill="#87CEFA" />
      <polygon points="10,40 30,40 50,90" fill="#6495ED" />
      <polygon points="90,40 70,40 50,90" fill="#4682B4" />
    </svg>
  );
}
