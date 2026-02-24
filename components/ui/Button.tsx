import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    children: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, disabled, children, ...props }, ref) => {
        const baseStyles = 'btn inline-flex items-center justify-center font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

        const variants = {
            primary: 'bg-gradient-primary text-white hover:opacity-90 hover:shadow-lg focus:ring-primary',
            secondary: 'bg-gradient-secondary text-white hover:opacity-90 hover:shadow-lg focus:ring-secondary',
            outline: 'border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-white focus:ring-primary',
            ghost: 'text-primary hover:bg-primary/10 focus:ring-primary',
            danger: 'bg-error text-white hover:bg-red-600 hover:shadow-lg focus:ring-error',
        };

        const sizes = {
            sm: 'text-sm px-3 py-1.5 rounded-md',
            md: 'text-base px-6 py-2.5 rounded-lg',
            lg: 'text-lg px-8 py-3 rounded-xl',
        };

        return (
            <button
                ref={ref}
                className={cn(baseStyles, variants[variant], sizes[size], className)}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Loading...
                    </>
                ) : (
                    children
                )}
            </button>
        );
    }
);

Button.displayName = 'Button';

export default Button;
