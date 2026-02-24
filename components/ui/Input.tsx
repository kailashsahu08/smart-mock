import React, { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, icon, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-foreground mb-2">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {icon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
                            {icon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        className={cn(
                            'input w-full',
                            icon && 'pl-10',
                            error && 'border-error focus:border-error focus:ring-error',
                            className
                        )}
                        {...props}
                    />
                </div>
                {error && (
                    <p className="mt-1 text-sm text-error">{error}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;
