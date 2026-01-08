import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number) {
    return new Intl.NumberFormat('fr-FR').format(Math.round(amount)) + ' F';
}

export function isValidIvorianPhone(phone: string) {
    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, '');
    // Must be 10 digits and start with 01, 05, or 07
    return /^(01|05|07)\d{8}$/.test(digits);
}

export function formatIvorianPhone(phone: string) {
    const digits = phone.replace(/\D/g, '').slice(0, 10);
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return `${digits.slice(0, 2)} ${digits.slice(2)}`;
    if (digits.length <= 6) return `${digits.slice(0, 2)} ${digits.slice(2, 4)} ${digits.slice(4)}`;
    if (digits.length <= 8) return `${digits.slice(0, 2)} ${digits.slice(2, 4)} ${digits.slice(4, 6)} ${digits.slice(6)}`;
    return `${digits.slice(0, 2)} ${digits.slice(2, 4)} ${digits.slice(4, 6)} ${digits.slice(6, 8)} ${digits.slice(8)}`;
}

export const  API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.biosante.sublymus.com';
