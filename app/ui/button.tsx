import * as React from 'react'
import { Button as AriaButton } from 'ariakit/button'
import { twMerge } from 'tailwind-merge'
import clsx from 'clsx'

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  className?: string
  variant?: 'primary' | 'secondary' | 'white' | 'success' | 'error'
}

export type Ref = HTMLButtonElement

const variants = {
  primary: 'border-transparent bg-blue-600 hover:bg-blue-700 text-white',
  secondary: 'border-transparent bg-blue-100 hover:bg-blue-200 text-blue-700',
  white: 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50',
  success: 'border-transparent bg-green-500 hover:bg-green-600 text-white',
  error: 'border-transparent bg-rose-600 hover:bg-rose-700 text-white',
}

const Button = React.forwardRef<Ref, Props>(
  ({ children, className, variant = 'primary', ...props }: Props, ref) => (
    <AriaButton
      className={twMerge(
        clsx(
          'inline-flex justify-center px-4 py-2 border text-sm shadow-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
          variants[variant],
          className,
          props.disabled && 'opacity-30',
        ),
      )}
      {...props}
      ref={ref}
    >
      {children}
    </AriaButton>
  ),
)

Button.displayName = 'Button'

export default Button
