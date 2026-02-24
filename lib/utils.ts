import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Format date to readable string
 */
export function formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

/**
 * Format time in seconds to MM:SS
 */
export function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Calculate percentage
 */
export function calculatePercentage(obtained: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((obtained / total) * 100);
}

/**
 * Get difficulty color
 */
export function getDifficultyColor(difficulty: string): string {
    switch (difficulty.toLowerCase()) {
        case 'easy':
            return 'text-green-600 bg-green-100';
        case 'medium':
            return 'text-yellow-600 bg-yellow-100';
        case 'hard':
            return 'text-red-600 bg-red-100';
        default:
            return 'text-gray-600 bg-gray-100';
    }
}

/**
 * Get score color based on percentage
 */
export function getScoreColor(percentage: number): string {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-blue-600';
    if (percentage >= 40) return 'text-yellow-600';
    return 'text-red-600';
}

/**
 * Truncate text
 */
export function truncate(text: string, length: number): string {
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
}
