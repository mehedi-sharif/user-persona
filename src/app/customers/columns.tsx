"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Customer } from "@/types/customer"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet"
import { CustomerSheet } from "@/components/customer-sheet"

export const columns: ColumnDef<Customer>[] = [
    {
        accessorKey: "full_name",
        header: "Customer",
        cell: ({ row }) => {
            const customer = row.original
            const name = customer.full_name || "Unknown Customer"
            const initials = name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()

            return (
                <Sheet>
                    <SheetTrigger asChild>
                        <div className="flex items-center gap-4 py-2 cursor-pointer rounded-lg transition-colors -ml-2 px-2">
                            <Avatar className="h-12 w-12 border-1 border-border avatar">
                                {customer.image && (
                                    <AvatarImage src={customer.image} alt={name} className="object-cover" />
                                )}
                                <AvatarFallback className="bg-primary/5 text-primary font-bold">{initials}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col gap-0.5">
                                <span className="font-bold text-[15px] leading-tight text-foreground">{name}</span>
                                <span className="text-[13px] text-muted-foreground/80 leading-tight">{customer.email}</span>
                            </div>
                        </div>
                    </SheetTrigger>
                    <SheetContent side="right" className="sm:max-w-3xl overflow-y-auto bg-white p-8">
                        <SheetTitle className="sr-only">Customer Details - {name}</SheetTitle>
                        <SheetDescription className="sr-only">
                            Detailed information and activity history for {name}.
                        </SheetDescription>
                        <CustomerSheet customer={customer} />
                    </SheetContent>
                </Sheet>
            )
        },
    },
    {
        accessorKey: "createdAt",
        header: "Created",
        cell: ({ row }) => {
            const date = row.getValue("createdAt") as string
            if (!date) return <span className="text-sm text-muted-foreground">N/A</span>
            return (
                <span suppressHydrationWarning className="text-[14px] font-medium text-foreground">
                    {new Date(date).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                    })}
                </span>
            )
        },
    },
    {
        accessorKey: "country",
        header: "Location",
        cell: ({ row }) => (
            <span className="text-[14px] font-medium text-foreground">
                {row.getValue("country") || "Unknown"}
            </span>
        ),
    },
    {
        accessorKey: "package",
        header: "Package",
        cell: () => <span className="text-[14px] text-muted-foreground">-</span>,
    },
    {
        accessorKey: "status",
        header: () => <div className="text-right pr-4">Status</div>,
        cell: ({ row }) => {
            const customer = row.original
            const isPaid = customer.orders && customer.orders.length > 0

            return (
                <div className="flex justify-end pr-4">
                    <Badge
                        variant="outline"
                        className={isPaid
                            ? "bg-green-50 text-green-600 border-green-200 hover:bg-green-50 text-[11px] font-semibold py-0 h-6 px-2"
                            : "bg-red-50 text-red-600 border-red-100 hover:bg-red-50 text-[11px] font-semibold py-0 h-6 px-2"
                        }
                    >
                        {isPaid ? 'Paid' : 'No Purchase'}
                    </Badge>
                </div>
            )
        },
    },
]
