import { type SVGProps } from "react";

interface ChevronUpProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

const ChevronUp = ({ size = 16, className = "", ...props }: ChevronUpProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      className={className}
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.52864 5.52857C7.78897 5.26823 8.21111 5.26823 8.47144 5.52857L12.4714 9.52858C12.7318 9.78891 12.7318 10.211 12.4714 10.4714C12.2111 10.7317 11.789 10.7317 11.5286 10.4714L8.00004 6.94278L4.47145 10.4714C4.21109 10.7317 3.78899 10.7317 3.52863 10.4714C3.26829 10.211 3.26829 9.78891 3.52863 9.52858L7.52864 5.52857Z"
        fill="#C37613"
      />
    </svg>
  );
};

export default ChevronUp;
