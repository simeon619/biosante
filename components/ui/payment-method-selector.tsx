"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { CheckCircle, Banknote, Wallet } from "lucide-react"

interface PaymentMethodOption {
    value: 'cash' | 'online'
    title: string
    description: string
    icon: React.ReactNode
    badges?: { label: string; color: string }[]
}

interface PaymentMethodSelectorProps {
    value: 'cash' | 'online'
    onChange: (value: 'cash' | 'online') => void
    className?: string
}

const paymentOptions: PaymentMethodOption[] = [
    {
        value: 'cash',
        title: 'Paiement à la livraison',
        description: 'Payez en espèces au livreur',
        icon: <Banknote className="w-6 h-6" />,
    },
    {
        value: 'online',
        title: 'Paiement Mobile Money',
        description: 'Paiement instantané et sécurisé',
        icon: <Wallet className="w-6 h-6" />,
        badges: [
            { label: 'Orange', color: 'bg-orange-500' },
            { label: 'MTN', color: 'bg-yellow-500' },
            { label: 'Wave', color: 'bg-blue-500' },
            { label: 'Moov', color: 'bg-purple-500' },
        ],
    },
]

export function PaymentMethodSelector({ value, onChange, className }: PaymentMethodSelectorProps) {
    return (
        <div className={cn("space-y-3", className)}>
            {paymentOptions.map((option) => {
                const isSelected = value === option.value
                const colorClass = option.value === 'cash'
                    ? 'border-green-500 bg-green-50/80 shadow-green-100'
                    : 'border-primary-500 bg-primary-50/80 shadow-primary-100'

                return (
                    <label
                        key={option.value}
                        className={cn(
                            "relative flex items-center gap-4 p-5 border-2 rounded-2xl cursor-pointer transition-all duration-200",
                            isSelected
                                ? `${colorClass} shadow-lg scale-[1.02]`
                                : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
                        )}
                    >
                        <input
                            type="radio"
                            name="paymentMethod"
                            value={option.value}
                            checked={isSelected}
                            onChange={() => onChange(option.value)}
                            className="sr-only"
                        />

                        {/* Icon */}
                        <div className={cn(
                            "flex items-center justify-center p-3 rounded-xl transition-all",
                            isSelected && option.value === 'cash' && "bg-green-100 text-green-600",
                            isSelected && option.value === 'online' && "bg-primary-100 text-primary-600",
                            !isSelected && "bg-gray-100 text-gray-500"
                        )}>
                            {option.icon}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <p className={cn(
                                "font-bold text-base",
                                isSelected ? "text-gray-900" : "text-gray-700"
                            )}>
                                {option.title}
                            </p>
                            <p className="text-sm text-gray-500 mt-0.5">
                                {option.description}
                            </p>

                            {/* Badges for payment providers */}
                            {option.badges && (
                                <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                                    {option.badges.map((badge) => (
                                        <span
                                            key={badge.label}
                                            className={cn(
                                                "inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold text-white shadow-sm",
                                                badge.color
                                            )}
                                        >
                                            {badge.label}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Checkmark */}
                        <div className={cn(
                            "flex-shrink-0 transition-all duration-200",
                            isSelected ? "opacity-100 scale-100" : "opacity-0 scale-75"
                        )}>
                            <CheckCircle className={cn(
                                "w-6 h-6",
                                option.value === 'cash' ? "text-green-500" : "text-primary-500"
                            )} />
                        </div>

                        {/* Selection ring effect */}
                        {isSelected && (
                            <div className={cn(
                                "absolute inset-0 rounded-2xl ring-2 ring-offset-2",
                                option.value === 'cash' ? "ring-green-400" : "ring-primary-400"
                            )} />
                        )}
                    </label>
                )
            })}
        </div>
    )
}
