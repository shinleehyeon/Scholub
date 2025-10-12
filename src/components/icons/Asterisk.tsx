interface AsteriskProps {
  className?: string
  size?: number
}

export default function Asterisk({ className, size = 18 }: AsteriskProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 5C12.5523 5 13 5.44772 13 6V18C13 18.5523 12.5523 19 12 19C11.4477 19 11 18.5523 11 18V6C11 5.44772 11.4477 5 12 5Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18.0619 8.50003C18.3381 8.97832 18.1742 9.58992 17.6959 9.86606L7.30389 15.8661C6.8256 16.1422 6.21401 15.9783 5.93786 15.5001C5.66171 15.0218 5.82558 14.4102 6.30387 14.134L16.6959 8.13403C17.1742 7.85788 17.7858 8.02174 18.0619 8.50003Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.93786 8.50003C6.21401 8.02174 6.8256 7.85788 7.30389 8.13403L17.6959 14.134C18.1742 14.4102 18.3381 15.0218 18.0619 15.5001C17.7858 15.9783 17.1742 16.1422 16.6959 15.8661L6.30387 9.86606C5.82558 9.58992 5.66171 8.97832 5.93786 8.50003Z"
        fill="currentColor"
      />
    </svg>
  )
}

