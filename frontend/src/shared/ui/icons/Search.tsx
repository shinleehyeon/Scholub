import { type SVGProps } from "react";

interface SearchIconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

const Search = ({ size = 16, className = "", ...props }: SearchIconProps) => {
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
        d="M7.33331 2.66665C4.75599 2.66665 2.66665 4.75599 2.66665 7.33331C2.66665 9.91065 4.75599 12 7.33331 12C9.91065 12 12 9.91065 12 7.33331C12 4.75599 9.91065 2.66665 7.33331 2.66665ZM1.33331 7.33331C1.33331 4.01961 4.01961 1.33331 7.33331 1.33331C10.647 1.33331 13.3333 4.01961 13.3333 7.33331C13.3333 10.647 10.647 13.3333 7.33331 13.3333C4.01961 13.3333 1.33331 10.647 1.33331 7.33331Z"
        fill="var(--color-brand-default)"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.6619 10.6619C10.9223 10.4015 11.3443 10.4015 11.6047 10.6619L14.4714 13.5285C14.7317 13.7889 14.7317 14.211 14.4714 14.4714C14.211 14.7317 13.7889 14.7317 13.5285 14.4714L10.6619 11.6047C10.4015 11.3443 10.4015 10.9223 10.6619 10.6619Z"
        fill="var(--color-brand-default)"
      />
    </svg>
  );
};

export default Search;
