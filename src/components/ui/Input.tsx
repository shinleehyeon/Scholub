import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '../../lib/utils'
import Asterisk from '../icons/Asterisk'

const inputWrapperVariants = cva(
  'inline-flex border transition-all duration-200 ease-in-out relative overflow-hidden bg-[var(--color-surface-default)] border-gray-300 focus-within:outline-none hover:border-gray-400',
  {
    variants: {
      size: {
        small: 'w-56 items-center py-[var(--spacing-10)] px-[var(--spacing-12)] gap-[var(--spacing-8)] rounded-[var(--radius-12)]',
        large: 'w-56 items-start p-[var(--spacing-14)] gap-[var(--spacing-8)] rounded-[var(--radius-14)]',
      },
      variant: {
        primary: 'focus-within:border-gray-900 focus-within:ring-2 focus-within:ring-gray-900/10',
        secondary: 'bg-[var(--color-surface-subtle)] focus-within:bg-[var(--color-surface-default)] focus-within:border-gray-900 focus-within:ring-2 focus-within:ring-gray-900/10',
      },
      error: {
        true: 'border-red-400 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-500/10',
      },
      disabled: {
        true: 'opacity-60 cursor-not-allowed bg-[var(--color-surface-subtle)]',
      },
      fullWidth: {
        true: 'w-full',
      },
      hasLeftIcon: {
        true: '',
      },
      hasRightIcon: {
        true: '',
      },
    },
      defaultVariants: {
      size: 'small',
      variant: 'primary',
      error: false,
      disabled: false,
      fullWidth: false,
    },
  }
)

const iconVariants = cva(
  'flex items-center justify-center text-[var(--color-text-subtle)] transition-colors duration-200',
  {
    variants: {
      size: {
        small: '[&>svg]:w-4 [&>svg]:h-4',
        large: '[&>svg]:w-4 [&>svg]:h-4',
      },
      position: {
        left: '',
        right: '',
      },
    },
    defaultVariants: {
      size: 'small',
    },
  }
)

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  size?: 'small' | 'large'
  variant?: 'primary' | 'secondary'
  error?: string
  fullWidth?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  required?: boolean
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      size = 'small',
      variant = 'primary',
      error,
      disabled,
      className,
      fullWidth = false,
      leftIcon,
      rightIcon,
      required = false,
      ...props
    },
    ref
  ) => {
    return (
      <div
        className={cn('flex flex-col gap-[var(--spacing-6)]', fullWidth && 'w-full')}
      >
        {label && (
          <label className="flex items-center gap-[var(--spacing-4)] text-sm font-medium text-[var(--color-text-default)] leading-5 mb-[var(--spacing-4)]">
            {label}
            {required && <Asterisk className="text-[#FF5E5E]" size={18} />}
          </label>
        )}
        <div
          className={cn(
            inputWrapperVariants({
              size,
              variant,
              error: !!error,
              disabled: disabled,
              fullWidth,
              hasLeftIcon: !!leftIcon,
              hasRightIcon: !!rightIcon,
            }),
            'group',
            className
          )}
        >
          {leftIcon && (
            <div
              className={cn(
                iconVariants({ size, position: 'left' }),
                'group-focus-within:text-gray-900 transition-colors duration-200'
              )}
            >
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className="flex-1 border-0 outline-none bg-transparent text-[var(--color-text-default)] placeholder:text-[var(--color-text-subtle)] disabled:cursor-not-allowed disabled:text-[var(--color-text-subtle)] font-medium text-sm leading-5"
            disabled={disabled}
            required={required}
            {...props}
          />
          {rightIcon && (
            <div
              className={cn(
                iconVariants({ size, position: 'right' }),
                'group-focus-within:text-gray-900 transition-colors duration-200'
              )}
            >
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <div className="text-xs text-[var(--color-brand-default)] mt-[var(--spacing-4)] font-normal">{error}</div>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input }