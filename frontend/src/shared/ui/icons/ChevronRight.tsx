import { type SVGProps } from "react";

interface ChevronRightProps extends SVGProps<SVGSVGElement> {
  size?: number;
  fillColor?: string;
}

const ChevronRight = ({
  size = 64,
  className = "",
  fillColor = "white",
  ...props
}: ChevronRightProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M22.1144 14.1144C23.1558 13.073 24.8443 13.073 25.8857 14.1144L41.8856 30.1144C42.927 31.1557 42.927 32.8443 41.8856 33.8856L25.8857 49.8856C24.8443 50.9269 23.1558 50.9269 22.1144 49.8856C21.073 48.8443 21.073 47.1557 22.1144 46.1144L36.2288 32L22.1144 17.8856C21.073 16.8442 21.073 15.1558 22.1144 14.1144Z"
        fill={fillColor}
      />
    </svg>
  );
};

export default ChevronRight;
