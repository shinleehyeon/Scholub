import { type SVGProps } from "react";

interface XProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

const X = ({ size = 20, className = "", ...props }: XProps) => {
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
        d="M15.5892 4.41074C15.9146 4.73618 15.9146 5.26381 15.5892 5.58926L5.58922 15.5892C5.26378 15.9147 4.73614 15.9147 4.4107 15.5892C4.08527 15.2638 4.08527 14.7362 4.4107 14.4107L14.4107 4.41074C14.7361 4.08531 15.2638 4.08531 15.5892 4.41074Z"
        fill="var(--color-text-subtle)"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.4107 4.41074C4.73614 4.08531 5.26378 4.08531 5.58922 4.41074L15.5892 14.4107C15.9146 14.7362 15.9146 15.2638 15.5892 15.5892C15.2638 15.9147 14.7361 15.9147 14.4107 15.5892L4.4107 5.58926C4.08527 5.26381 4.08527 4.73618 4.4107 4.41074Z"
        fill="var(--color-text-subtle)"
      />
    </svg>
  );
};

export default X;

