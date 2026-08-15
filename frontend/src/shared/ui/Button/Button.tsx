import { forwardRef, cloneElement, isValidElement } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/lib/utils";

const buttonVariants = cva(
  "inline-flex h-fit items-center justify-center gap-[8px] border-0 font-medium cursor-pointer relative overflow-hidden whitespace-nowrap transition-all duration-200 ease-in-out focus:outline-none active:scale-[0.92] disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none font-[Pretendard]",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--color-surface-brand-default)] text-[var(--color-text-white)] hover:opacity-90 disabled:bg-[var(--color-surface-brand-subtle)] disabled:text-[var(--color-text-subtle)]",
        secondary:
          "bg-[var(--color-surface-subtle)] text-[var(--color-text-subtle)] hover:opacity-80 disabled:bg-[var(--color-surface-subtle)] disabled:text-[var(--color-text-subtle)]",
        tertiary:
          "bg-[var(--color-surface-subtle)] text-[var(--color-text-subtle)] hover:opacity-80",
      },
      size: {
        medium: "px-[16px] py-[10px] text-[14px] leading-[140%] rounded-[14px]",
        large: "px-[24px] py-[16px] text-[16px] leading-[150%] rounded-[16px]",
      },
      fullWidth: {
        true: "w-full",
      },
      pending: {
        true: "cursor-wait",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "medium",
      fullWidth: false,
      pending: false,
    },
  }
);

const iconContainerClass = "flex items-center justify-center flex-shrink-0";

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: ReactNode;
  pending?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      pending = false,
      disabled,
      children,
      leadingIcon,
      trailingIcon,
      ...props
    },
    ref
  ) => {
    const getStyle = () => {
      const baseStyle: React.CSSProperties = {};
      if (variant === "primary") {
        baseStyle.backgroundColor = "var(--color-surface-brand-default)";
      }
      return { ...baseStyle, ...props.style };
    };

    const iconSize = size === "large" ? 20 : 16;

    const renderIcon = (icon: ReactNode) => {
      if (!icon) return null;
      if (isValidElement(icon) && typeof icon.type !== "string") {
        const existingStyle =
          (icon as React.ReactElement<any>).props?.style || {};
        const restStyle = { ...existingStyle };
        delete restStyle.width;
        delete restStyle.height;
        return cloneElement(icon as React.ReactElement<any>, {
          size: iconSize,
          style: {
            ...restStyle,
            width: `${iconSize}px`,
            height: `${iconSize}px`,
          },
        });
      }
      return icon;
    };

    return (
      <button
        className={cn(
          buttonVariants({
            variant,
            size,
            fullWidth,
            pending: pending,
            className,
          })
        )}
        style={getStyle()}
        ref={ref}
        disabled={disabled || pending}
        {...props}
      >
        {pending && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 border-2 border-transparent border-t-current rounded-full animate-spin" />
        )}
        <div
          className={cn("flex items-center gap-[8px]", pending && "opacity-0")}
        >
          {leadingIcon && (
            <span
              className={iconContainerClass}
              style={{
                width: `${iconSize}px`,
                height: `${iconSize}px`,
              }}
            >
              {renderIcon(leadingIcon)}
            </span>
          )}
          <span className="flex-1">{children}</span>
          {trailingIcon && (
            <span
              className={iconContainerClass}
              style={{
                width: `${iconSize}px`,
                height: `${iconSize}px`,
              }}
            >
              {renderIcon(trailingIcon)}
            </span>
          )}
        </div>
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
