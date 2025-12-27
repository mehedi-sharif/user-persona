"use client"

import * as React from "react"
import { Customer } from "@/types/customer"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Copy,
} from "lucide-react"

interface CustomerSheetProps {
    customer: Customer
}

export function CustomerSheet({ customer }: CustomerSheetProps) {
    const name = customer.full_name || "Unknown Customer"
    const initials = name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()



    const formattedDate = new Date(customer.createdAt).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    })

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Avatar className="h-16 w-16 border-2 border-border shadow-md">
                    {customer.image && (
                        <AvatarImage src={customer.image} alt={name} className="object-cover" />
                    )}
                    <AvatarFallback className="bg-[#FFBD00] text-black font-bold text-2xl">
                        {initials}
                    </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold text-foreground">{name}</h2>
                        {customer.country === "India" && <span>🇮🇳</span>}
                    </div>
                    <div className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
                        <span>{customer.email}</span>
                        <Copy className="w-3.5 h-3.5 cursor-pointer hover:text-foreground transition-colors" />
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 gap-6 pb-8">
                {/* User Details - Full Width */}
                <div className="space-y-6">
                    {/* User Details */}
                    <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm space-y-4">
                        <h3 className="text-[14px] font-bold text-gray-900 border-b pb-3 -mx-5 px-5">User Details</h3>
                        <div className="space-y-3.5 pt-1">
                            <DetailRow label="Name:" value={name} />
                            <DetailRow
                                label="Country:"
                                value={
                                    <div className="flex items-center gap-1.5">
                                        {customer.country || "Unknown"} {customer.country === "India" && "🇮🇳"}
                                    </div>
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function DetailRow({ label, value }: { label: string, value: React.ReactNode }) {
    return (
        <div className="flex items-start text-[13px]">
            <span className="text-gray-500 w-28 shrink-0">{label}</span>
            <span className="text-gray-900 font-medium">{value}</span>
        </div>
    )
}


