import React, { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'glass' | 'gradient';
    hover?: boolean;
    children: React.ReactNode;
}

const Card = ({ className, variant = 'default', hover = false, children, ...props }: CardProps) => {
    const baseStyles = 'card rounded-xl p-6 transition-all duration-300';

    const variants = {
        default: 'bg-card shadow-md',
        glass: 'glass shadow-lg',
        gradient: 'bg-gradient-primary text-white shadow-lg',
    };

    const hoverStyles = hover ? 'hover-lift cursor-pointer' : '';

    return (
        <div className={cn(baseStyles, variants[variant], hoverStyles, className)} {...props}>
            {children}
        </div>
    );
};

export default Card;
