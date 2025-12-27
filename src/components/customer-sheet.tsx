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
    ExternalLink,
    Monitor,
    Flag,
    User,
    Globe,
    LogIn,
    Github,
    MoreHorizontal
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
                    <AvatarImage src={customer.image || ""} alt={name} className="object-cover" />
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
                    <a href="#" className="text-[12px] font-medium text-pink-600 hover:underline">
                        Recordings
                    </a>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">
                {/* Left Column */}
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
                            <DetailRow
                                label="Referrer:"
                                value={<a href="#" className="text-blue-600 hover:underline truncate block max-w-[180px]">https://themefisher.com/</a>}
                            />
                            <DetailRow
                                label="Landing Page:"
                                value={<a href="#" className="text-blue-600 hover:underline">/login</a>}
                            />
                            <DetailRow
                                label="Device:"
                                value={
                                    <div className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-[12px] font-medium pr-3">
                                        <Monitor className="w-3.5 h-3.5" /> Mac OS
                                    </div>
                                }
                            />
                        </div>
                    </div>

                    {/* User Activity */}
                    <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm space-y-4">
                        <h3 className="text-[14px] font-bold text-gray-900 border-b pb-3 -mx-5 px-5">User Activity</h3>
                        <div className="space-y-6 pt-2 pl-2">
                            <ActivityItem
                                icon={<Flag className="w-3.5 h-3.5" />}
                                label="First Visit"
                                date={formattedDate}
                            />
                            <ActivityItem
                                icon={<User className="w-3.5 h-3.5" />}
                                label="Account Created"
                                date={formattedDate}
                            />
                            <ActivityItem
                                icon={<Globe className="w-3.5 h-3.5" />}
                                label="Visit Website"
                                date={formattedDate}
                            />
                            <ActivityItem
                                icon={<LogIn className="w-3.5 h-3.5" />}
                                label="Login to Dashboard"
                                date={formattedDate}
                            />
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Organizations */}
                    <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm space-y-4">
                        <div className="flex items-center justify-between border-b pb-3 -mx-5 px-5">
                            <h3 className="text-[14px] font-bold text-gray-900">Organizations</h3>
                        </div>
                        <div className="flex items-start justify-between group pt-1">
                            <div className="space-y-0.5">
                                <div className="text-[13px] font-bold text-gray-900">{name.split(' ')[0]}'s Org</div>
                                <div className="text-[11px] text-gray-400">ID: 8JAmJIDTC</div>
                            </div>
                            <Badge variant="outline" className="bg-green-50 text-green-600 border-green-100 text-[10px] h-5 px-1.5 font-medium">
                                Default
                            </Badge>
                        </div>
                    </div>

                    {/* Projects */}
                    <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm space-y-4">
                        <h3 className="text-[14px] font-bold text-gray-900 border-b pb-3 -mx-5 px-5">Projects</h3>
                        <div className="flex items-start justify-between pt-1">
                            <div className="space-y-0.5">
                                <div className="text-[13px] font-bold text-gray-900">odfense-astro</div>
                                <div className="text-[11px] text-gray-400">ID: 0dUF7Y12UP</div>
                            </div>
                            <div className="text-[11px] font-medium text-gray-500">Github</div>
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm space-y-4">
                        <h3 className="text-[14px] font-bold text-gray-900 border-b pb-3 -mx-5 px-5">Notes</h3>
                        <div className="space-y-3 pt-1">
                            <Textarea
                                placeholder="Add notes..."
                                className="min-h-[100px] bg-gray-50/30 border-gray-200 text-[13px] resize-none"
                                defaultValue={customer.raw_notes || ""}
                            />
                            <Button className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold h-9 text-[13px]">
                                Save
                            </Button>
                        </div>
                    </div>

                    {/* Update Email */}
                    <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm space-y-4">
                        <h3 className="text-[14px] font-bold text-gray-900 border-b pb-3 -mx-5 px-5">Update Email</h3>
                        <div className="space-y-3 pt-1">
                            <Input
                                defaultValue={customer.email}
                                className="h-9 bg-gray-50/30 border-gray-200 text-[13px]"
                            />
                            <Button className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold h-9 text-[13px]">
                                Save
                            </Button>
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

function ActivityItem({ icon, label, date }: { icon: React.ReactNode, label: string, date: string }) {
    return (
        <div className="flex gap-4 relative">
            <div className="absolute left-[13px] top-6 bottom-[-24px] w-[1px] bg-gray-100 last:hidden" />
            <div className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0 z-10 text-gray-600">
                {icon}
            </div>
            <div className="space-y-0.5 pt-0.5">
                <div className="text-[13px] font-bold text-gray-900">{label}</div>
                <div className="text-[11px] text-gray-400">{date}</div>
            </div>
        </div>
    )
}
