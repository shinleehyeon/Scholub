import { type ReactNode, cloneElement, isValidElement } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/lib/utils";

const chipVariants = cva(
  "inline-flex justify-center items-center rounded-[var(--radius-9999)] cursor-pointer transition-all duration-200 whitespace-nowrap flex-shrink-0",
  {
    variants: {
      status: {
        default:
          "border border-[var(--color-border-default)] bg-[var(--color-surface-default)]",
        selected: "border-none",
      },
      size: {
        small:
          "px-[var(--spacing-12)] py-[var(--spacing-8)] gap-[var(--spacing-4)] text-[12px] font-medium leading-[16px]",
        large:
          "px-[var(--spacing-14)] py-[var(--spacing-10)] gap-[var(--spacing-6)] text-[17px] font-medium leading-[24px]",
      },
    },
    defaultVariants: {
      status: "default",
      size: "small",
    },
  }
);

export interface ChipProps extends VariantProps<typeof chipVariants> {
  children: ReactNode;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  className?: string;
  onClick?: () => void;
  useErrorColor?: boolean;
}

export default function Chip({
  status,
  size,
  children,
  leadingIcon,
  trailingIcon,
  className,
  onClick,
  useErrorColor = false,
}: ChipProps) {
  const renderIcon = (icon: ReactNode) => {
    if (!icon) return null;
    if (isValidElement(icon) && typeof icon.type !== "string") {
      return cloneElement(icon as React.ReactElement<any>, {
        size: size === "large" ? 18 : 14,
      });
    }
    return icon;
  };

  return (
    <span
      onClick={onClick}
      className={cn(
        chipVariants({ status, size }),
        status === "default"
          ? "text-[var(--color-text-default)] hover:border-[var(--color-brand-default)]"
          : useErrorColor
            ? "bg-[var(--color-surface-error)] text-[var(--color-text-error)] hover:opacity-90"
            : "bg-[var(--color-surface-brand-default)] text-[var(--color-text-white)] hover:opacity-90",
        className
      )}
    >
      {leadingIcon && (
        <span className="flex-shrink-0">{renderIcon(leadingIcon)}</span>
      )}
      <span className="text-inherit whitespace-nowrap">{children}</span>
      {trailingIcon && (
        <span className="flex-shrink-0">{renderIcon(trailingIcon)}</span>
      )}
    </span>
  );
}
