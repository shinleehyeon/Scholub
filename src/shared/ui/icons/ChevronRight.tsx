import { type SVGProps } from "react";

interface ChevronRightProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

const ChevronRight = ({
  size = 20,
  className = "",
  ...props
}: ChevronRightProps) => {
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
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.91075 4.41073C7.23619 4.0853 7.76382 4.0853 8.08926 4.41073L13.0893 9.41074C13.4147 9.73616 13.4147 10.2638 13.0893 10.5892L8.08926 15.5892C7.76382 15.9147 7.23619 15.9147 6.91075 15.5892C6.58531 15.2638 6.58531 14.7362 6.91075 14.4107L11.3215 9.99999L6.91075 5.58925C6.58531 5.26381 6.58531 4.73617 6.91075 4.41073Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default ChevronRight;
