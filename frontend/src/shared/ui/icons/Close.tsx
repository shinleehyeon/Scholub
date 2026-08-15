import { type SVGProps } from "react";

interface CloseIconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

const Close = ({ size = 16, className = "", ...props }: CloseIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      className={`cursor-pointer ${className}`}
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.4714 3.5286C12.7317 3.78896 12.7317 4.21106 12.4714 4.47142L4.47139 12.4714C4.21103 12.7317 3.78893 12.7317 3.52857 12.4714C3.26823 12.2111 3.26823 11.7889 3.52857 11.5286L11.5286 3.5286C11.7889 3.26826 12.211 3.26826 12.4714 3.5286Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.52857 3.5286C3.78893 3.26826 4.21103 3.26826 4.47139 3.5286L12.4714 11.5286C12.7317 11.7889 12.7317 12.2111 12.4714 12.4714C12.211 12.7317 11.7889 12.7317 11.5286 12.4714L3.52857 4.47142C3.26823 4.21106 3.26823 3.78896 3.52857 3.5286Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default Close;
