import { forwardRef } from 'react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const buttonVariants = cva(
  'inline-flex h-fit items-center justify-center gap-[var(--spacing-8)] border-0 font-medium cursor-pointer relative overflow-hidden whitespace-nowrap transition-all duration-200 ease-in-out focus:outline-none active:scale-[0.92] disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none',
  {
    variants: {
      variant: {
        primary: 'bg-[var(--color-brand-default)] text-[var(--color-text-white)] hover:bg-[var(--color-brand-heavy)] disabled:bg-[var(--color-brand-subtle)] disabled:text-[var(--color-text-subtle)]',
        secondary: 'bg-[var(--color-surface-default)] text-[var(--color-text-default)] border border-[var(--color-border-default)] hover:bg-[var(--color-surface-subtle)]',
        tertiary: 'bg-[var(--color-surface-subtle)] text-[var(--color-text-subtle)] hover:bg-[var(--color-border-subtle)]',
      },
      size: {
        medium: 'px-[var(--spacing-16)] py-[var(--spacing-10)] text-sm leading-5 rounded-[var(--radius-14)]',
        large: 'px-[var(--spacing-24)] py-[var(--spacing-16)] text-base leading-6 rounded-[var(--radius-16)]',
      },
      fullWidth: {
        true: 'w-full',
      },
      pending: {
        true: 'cursor-wait',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'medium',
      fullWidth: false,
      pending: false,
    },
  }
)

const iconVariants = cva('flex items-center justify-center flex-shrink-0 aspect-square', {
  variants: {
    size: {
      medium: 'w-4 h-4 [&>svg]:w-4 [&>svg]:h-4',
      large: 'w-5 h-5 [&>svg]:w-5 [&>svg]:h-5',
    },
  },
  defaultVariants: {
    size: 'medium',
  },
})

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: ReactNode
  pending?: boolean
  leadingIcon?: ReactNode
  trailingIcon?: ReactNode
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
    return (
      <button
        className={cn(
          buttonVariants({ variant, size, fullWidth, pending: pending, className })
        )}
        ref={ref}
        disabled={disabled || pending}
        {...props}
      >
        {pending && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 border-2 border-transparent border-t-current rounded-full animate-spin" />
        )}
        <div
          className={cn(
            'flex items-center gap-[var(--spacing-8)]',
            pending && 'opacity-0'
          )}
        >
          {leadingIcon && (
            <span className={cn(iconVariants({ size }))}>{leadingIcon}</span>
          )}
          <span className="flex-1">{children}</span>
          {trailingIcon && (
            <span className={cn(iconVariants({ size }))}>{trailingIcon}</span>
          )}
        </div>
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }