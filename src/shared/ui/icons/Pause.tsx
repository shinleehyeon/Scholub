import { type SVGProps } from "react";

interface PauseProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

const Pause = ({ size = 20, className = "", ...props }: PauseProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      {...props}
    >
      <rect x="6" y="5" width="2" height="10" fill="currentColor" />
      <rect x="12" y="5" width="2" height="10" fill="currentColor" />
    </svg>
  );
};

export default Pause;
