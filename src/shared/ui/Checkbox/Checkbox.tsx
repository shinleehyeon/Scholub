import { Check, Minus } from "lucide-react";
import {
  type ChangeEvent,
  type InputHTMLAttributes,
  type ReactNode,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/shared/lib/utils";

const checkboxWrapperVariants = cva(
  "inline-flex items-center gap-[var(--spacing-8)] cursor-pointer select-none [-webkit-tap-highlight-color:transparent] text-[var(--color-text-default)]",
  {
    variants: {
      size: {
        sm: "",
        md: "",
        lg: "",
      },
      disabled: {
        true: "cursor-not-allowed opacity-60",
      },
      error: {
        true: "",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

const checkboxBoxVariants = cva(
  "flex items-center justify-center bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] text-white transition-all duration-150 ease-in-out aspect-square flex-shrink-0",
  {
    variants: {
      size: {
        sm: "w-4 h-4 rounded",
        md: "w-5 h-5 rounded-md",
        lg: "w-[22px] h-[22px] rounded-[var(--radius-8)]",
      },
      checked: {
        true: "bg-[var(--color-brand-default)] border-0",
      },
      disabled: {
        true: "opacity-60",
      },
      error: {
        true: "border-[var(--color-brand-default)] shadow-[0_0_0_3px_rgba(217,39,7,0.08)]",
      },
    },
    defaultVariants: {
      size: "md",
      checked: false,
      disabled: false,
      error: false,
    },
  }
);

const checkboxIconVariants = cva("text-white flex-shrink-0", {
  variants: {
    size: {
      sm: "w-3 h-3",
      md: "w-4 h-4",
      lg: "w-[14px] h-[14px]",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export type CheckboxSize = "sm" | "md" | "lg";

export interface CheckboxProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    | "type"
    | "size"
    | "onChange"
    | "checked"
    | "defaultChecked"
    | "children"
    | "dangerouslySetInnerHTML"
  > {
  checked?: boolean;
  defaultChecked?: boolean;
  indeterminate?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  size?: CheckboxSize;
  className?: string;
}

export default function Checkbox(props: CheckboxProps) {
  const {
    id,
    checked,
    defaultChecked,
    indeterminate = false,
    onCheckedChange,
    onChange,
    disabled,
    readOnly,
    label,
    description,
    error,
    size = "md",
    className,
    ...rest
  } = props;

  const inputProps = { ...rest };
  delete (inputProps as { children?: unknown }).children;
  delete (inputProps as { dangerouslySetInnerHTML?: unknown })
    .dangerouslySetInnerHTML;

  const isControlled = typeof checked === "boolean";
  const [internalChecked, setInternalChecked] = useState<boolean>(
    Boolean(defaultChecked)
  );
  const currentChecked = isControlled ? Boolean(checked) : internalChecked;

  const inputRef = useRef<HTMLInputElement | null>(null);
  const autoId = useId();
  const inputId = id || `cb_${autoId}`;
  const descriptionId = description ? `${inputId}-desc` : undefined;
  const errorId = error ? `${inputId}-err` : undefined;

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate =
        Boolean(indeterminate) && !currentChecked;
    }
  }, [indeterminate, currentChecked]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (disabled || readOnly) return;

    if (!isControlled) {
      setInternalChecked(e.target.checked);
    }
    onCheckedChange?.(e.target.checked);
    onChange?.(e);
  };

  return (
    <label
      className={cn(
        checkboxWrapperVariants({ size, disabled: disabled, error: !!error }),
        className
      )}
      htmlFor={inputId}
    >
      <span className="relative inline-flex items-center">
        <input
          id={inputId}
          ref={inputRef}
          type="checkbox"
          className="absolute inset-0 opacity-[0.0001] m-0"
          checked={currentChecked}
          onChange={handleChange}
          disabled={disabled}
          readOnly={readOnly}
          aria-checked={indeterminate ? "mixed" : currentChecked}
          aria-invalid={error ? true : undefined}
          aria-describedby={
            [descriptionId, errorId].filter(Boolean).join(" ") || undefined
          }
          {...inputProps}
        />
        <span
          className={cn(
            checkboxBoxVariants({
              size,
              checked: currentChecked || indeterminate,
              disabled: disabled,
              error: !!error,
            }),
            "hover:border-gray-400 dark:hover:border-gray-600",
            "focus-visible:shadow-[0_0_0_4px_rgba(69,193,255,0.18)] focus-visible:border-primary-600",
            disabled && "hover:border-gray-300 dark:hover:border-gray-700"
          )}
          aria-hidden="true"
        >
          {indeterminate ? (
            <Minus className={cn(checkboxIconVariants({ size }))} />
          ) : currentChecked ? (
            <Check className={cn(checkboxIconVariants({ size }))} />
          ) : null}
        </span>
      </span>

      {(label || description || error) && (
        <span className="flex flex-col gap-0.5">
          {label && (
            <span className="text-[17px] font-medium leading-6 text-[var(--color-text-default)]">
              {label}
            </span>
          )}
          {description && (
            <span
              id={descriptionId}
              className="text-xs text-[var(--color-text-subtle)]"
            >
              {description}
            </span>
          )}
          {error && (
            <span
              id={errorId}
              className="text-xs text-[var(--color-brand-default)]"
            >
              {error}
            </span>
          )}
        </span>
      )}
    </label>
  );
}

export { Checkbox };

