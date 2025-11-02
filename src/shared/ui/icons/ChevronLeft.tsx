import { type SVGProps } from "react";

interface ChevronLeftProps extends SVGProps<SVGSVGElement> {
  size?: number;
  fillColor?: string;
}

const ChevronLeft = ({
  size = 64,
  className = "",
  fillColor = "white",
  ...props
}: ChevronLeftProps) => {
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
        d="M41.8856 14.1144C42.9269 15.1558 42.9269 16.8442 41.8856 17.8856L27.7712 32L41.8856 46.1144C42.9269 47.1557 42.9269 48.8443 41.8856 49.8856C40.8443 50.9269 39.1557 50.9269 38.1144 49.8856L22.1144 33.8856C21.073 32.8443 21.073 31.1557 22.1144 30.1144L38.1144 14.1144C39.1557 13.073 40.8443 13.073 41.8856 14.1144Z"
        fill={fillColor}
      />
    </svg>
  );
};

export default ChevronLeft;
