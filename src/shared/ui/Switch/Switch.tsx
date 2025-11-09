import React, {
  useState,
  type ChangeEvent,
  type InputHTMLAttributes,
  useId,
} from "react";
import { cn } from "@/shared/lib/utils";

export interface SwitchProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "type" | "checked" | "defaultChecked" | "onChange"
  > {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: React.ReactNode;
  disabled?: boolean;
}

export default function Switch({
  checked,
  defaultChecked,
  onCheckedChange,
  disabled,
  label,
  className,
  id,
  ...rest
}: SwitchProps) {
  const isControlled = typeof checked === "boolean";
  const [internalChecked, setInternalChecked] = useState<boolean>(
    Boolean(defaultChecked)
  );
  const currentChecked = isControlled ? Boolean(checked) : internalChecked;
  const autoId = useId();
  const switchId = id || `switch-${autoId}`;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;

    if (!isControlled) {
      setInternalChecked(e.target.checked);
    }
    onCheckedChange?.(e.target.checked);
  };

  return (
    <label
      className={cn(
        "inline-flex items-center gap-[var(--spacing-12)] cursor-pointer select-none [-webkit-tap-highlight-color:transparent]",
        disabled && "cursor-not-allowed opacity-60",
        className
      )}
      htmlFor={switchId}
    >
      <input
        id={switchId}
        type="checkbox"
        className="sr-only"
        checked={currentChecked}
        onChange={handleChange}
        disabled={disabled}
        {...rest}
      />
      <div
        className={cn(
          "relative cursor-pointer",
          disabled && "cursor-not-allowed opacity-60"
        )}
        onClick={(e) => {
          if (!disabled) {
            e.preventDefault();
            const newChecked = !currentChecked;
            if (!isControlled) {
              setInternalChecked(newChecked);
            }
            onCheckedChange?.(newChecked);
          }
        }}
      >
        <div
          className={cn(
            "w-[50px] h-7 rounded-[30px] transition-all duration-500 ease-in-out",
            currentChecked
              ? "bg-[var(--color-brand-default)]"
              : "bg-[rgb(233,233,234)]"
          )}
        />
        <div
          className={cn(
            "absolute top-[3px] w-[22px] h-[22px] rounded-full bg-white transition-all duration-500 ease-in-out",
            currentChecked ? "left-[24px]" : "left-[3px]"
          )}
        />
      </div>
      {label && (
        <span className="text-[var(--color-text-default)]">{label}</span>
      )}
    </label>
  );
}
