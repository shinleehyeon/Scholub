import { forwardRef, useState, type InputHTMLAttributes } from "react";
import { cn } from "@/shared/lib/utils";
import SearchIcon from "./icons/Search";
import CloseIcon from "./icons/Close";

export interface SearchProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  fullWidth?: boolean;
  onClear?: () => void;
}

const Search = forwardRef<HTMLInputElement, SearchProps>(
  (
    {
      className,
      fullWidth = false,
      placeholder = "검색어를 입력하세요",
      value,
      onChange,
      onClear,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState("");

    const currentValue = value !== undefined ? value : internalValue;
    const hasValue = currentValue && String(currentValue).length > 0;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (value === undefined) {
        setInternalValue(e.target.value);
      }
      onChange?.(e);
    };

    const handleClear = () => {
      if (value === undefined) {
        setInternalValue("");
      }
      onClear?.();
      if (ref && typeof ref !== "function" && ref.current) {
        ref.current.value = "";
        ref.current.focus();
      }
    };

    return (
      <div
        className={cn(
          "flex items-center gap-[var(--spacing-6)] px-[var(--spacing-12)] py-[var(--spacing-10)] border border-[var(--color-border-default)] rounded-[var(--radius-12)] bg-[var(--color-surface-default)] hover:border-gray-400 focus-within:border-gray-900 focus-within:ring-2 focus-within:ring-gray-900/10 transition-all duration-200",
          fullWidth ? "w-full" : "w-[250px]",
          className
        )}
      >
        <div className="flex items-center justify-center flex-shrink-0 text-[var(--color-text-subtle)]">
          <SearchIcon size={16} />
        </div>
        <input
          ref={ref}
          type="text"
          placeholder={placeholder}
          value={currentValue}
          onChange={handleChange}
          className="flex-1 min-w-0 border-0 outline-none bg-transparent text-[var(--color-text-default)] placeholder:text-[var(--color-text-subtle)] font-medium text-sm leading-5 font-[Pretendard]"
          {...props}
        />
        {hasValue && (
          <div
            onClick={handleClear}
            className="flex items-center justify-center flex-shrink-0 cursor-pointer hover:opacity-70 transition-opacity text-[var(--color-text-default)]"
          >
            <CloseIcon size={16} />
          </div>
        )}
      </div>
    );
  }
);

Search.displayName = "Search";

export { Search };

/**
 * 사용법 예제:
 *
 *
 * <Search placeholder="검색어를 입력하세요" />
 *
 *
 * <Search fullWidth placeholder="검색" />
 *
 *
 * const [searchValue, setSearchValue] = useState("");
 * <Search
 *   value={searchValue}
 *   onChange={(e) => setSearchValue(e.target.value)}
 *   onClear={() => setSearchValue("")}
 * />
 *
 *
 * const searchRef = useRef<HTMLInputElement>(null);
 * <Search ref={searchRef} />
 */
