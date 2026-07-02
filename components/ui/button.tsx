import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'white';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
          {
            'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500 shadow-sm hover:shadow-medium active:scale-[0.98]': variant === 'primary',
            'bg-secondary-700 text-white hover:bg-secondary-800 focus:ring-secondary-500 shadow-sm hover:shadow-medium active:scale-[0.98]': variant === 'secondary',
            'border-2 border-primary-500 text-primary-600 hover:bg-primary-50 focus:ring-primary-500 active:scale-[0.98]': variant === 'outline',
            'text-secondary-600 hover:bg-secondary-50 focus:ring-secondary-300 active:scale-[0.98]': variant === 'ghost',
            'bg-white text-primary-600 hover:bg-primary-50 focus:ring-white shadow-sm hover:shadow-medium active:scale-[0.98]': variant === 'white',
          },
          {
            'px-4 py-2 text-sm gap-1.5': size === 'sm',
            'px-5 py-2.5 text-sm gap-2': size === 'md',
            'px-6 py-3 text-base gap-2': size === 'lg',
            'px-8 py-4 text-lg gap-2.5': size === 'xl',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button };
