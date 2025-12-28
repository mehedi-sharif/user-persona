"use client"

import * as React from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import {
    ArrowUpDown,
    ChevronDown,
    MoreHorizontal,
    Search,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Filter
} from "lucide-react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export function DataTable<TData, TValue>({
    columns,
    data,
    pageCount,
    currentPage = 1
}: {
    columns: ColumnDef<TData, TValue>[],
    data: TData[],
    pageCount?: number,
    currentPage?: number
}) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [paymentFilter, setPaymentFilter] = React.useState<string>("all")

    // Filter data based on payment status
    const filteredData = React.useMemo(() => {
        if (paymentFilter === "all") return data

        return data.filter((item: any) => {
            const hasOrders = item.orders && item.orders.length > 0
            if (paymentFilter === "paid") return hasOrders
            if (paymentFilter === "free") return !hasOrders
            return true
        })
    }, [data, paymentFilter])

    const table = useReactTable({
        data: filteredData,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            pagination: {
                pageIndex: currentPage - 1,
                pageSize: 100,
            }
        },
        manualPagination: pageCount !== undefined,
        pageCount: pageCount ?? -1,
        initialState: {
            pagination: {
                pageSize: 100,
            },
        },
    })

    return (
        <div className="w-full">
            <div className="flex items-center py-4 px-1">
                <div className="relative w-64">
                    <Input
                        placeholder="Search"
                        value={(table.getColumn("full_name")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("full_name")?.setFilterValue(event.target.value)
                        }
                        className="h-10 border-gray-200 rounded-md bg-white shadow-sm placeholder:text-gray-400"
                    />
                </div>

                <div className="ml-3">
                    <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                        <SelectTrigger className="h-10 w-[160px] border-gray-200 rounded-md bg-white shadow-sm">
                            <div className="flex items-center gap-2">
                                <Filter className="h-4 w-4 text-gray-500" />
                                <SelectValue placeholder="Filter by status" />
                            </div>
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                            <SelectItem value="all">All Customers</SelectItem>
                            <SelectItem value="paid">Paid Only</SelectItem>
                            <SelectItem value="free">Free Only</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="ml-auto flex items-center gap-6">
                    <div className="flex flex-col items-end">
                        <span className="text-[13px] font-medium text-gray-900">
                            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
                        </span>
                        <span className="text-[11px] text-gray-500">
                            {table.getFilteredRowModel().rows.length} items
                        </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-9 w-9 border-gray-200 rounded-md bg-white"
                            onClick={() => {
                                if (pageCount !== undefined) {
                                    const params = new URLSearchParams(searchParams.toString())
                                    params.set("page", "1")
                                    router.push(pathname + "?" + params.toString())
                                } else {
                                    table.setPageIndex(0)
                                }
                            }}
                            disabled={pageCount !== undefined ? currentPage <= 1 : !table.getCanPreviousPage()}
                        >
                            <ChevronsLeft className="h-4 w-4 text-gray-600" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-9 w-9 border-gray-200 rounded-md bg-white"
                            onClick={() => {
                                if (pageCount !== undefined) {
                                    const params = new URLSearchParams(searchParams.toString())
                                    params.set("page", String(currentPage - 1))
                                    router.push(pathname + "?" + params.toString())
                                } else {
                                    table.previousPage()
                                }
                            }}
                            disabled={pageCount !== undefined ? currentPage <= 1 : !table.getCanPreviousPage()}
                        >
                            <ChevronLeft className="h-4 w-4 text-gray-600" />
                        </Button>

                        <div className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 bg-white text-[13px] font-medium">
                            {table.getState().pagination.pageIndex + 1}
                        </div>

                        <Button
                            variant="outline"
                            size="icon"
                            className="h-9 w-9 border-gray-200 rounded-md bg-white"
                            onClick={() => {
                                if (pageCount !== undefined) {
                                    const params = new URLSearchParams(searchParams.toString())
                                    params.set("page", String(currentPage + 1))
                                    router.push(pathname + "?" + params.toString())
                                } else {
                                    table.nextPage()
                                }
                            }}
                            disabled={pageCount !== undefined ? currentPage >= (pageCount ?? 1) : !table.getCanNextPage()}
                        >
                            <ChevronRight className="h-4 w-4 text-gray-600" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-9 w-9 border-gray-200 rounded-md bg-white"
                            onClick={() => {
                                if (pageCount !== undefined) {
                                    const params = new URLSearchParams(searchParams.toString())
                                    params.set("page", String(pageCount))
                                    router.push(pathname + "?" + params.toString())
                                } else {
                                    table.setPageIndex(table.getPageCount() - 1)
                                }
                            }}
                            disabled={pageCount !== undefined ? currentPage >= (pageCount ?? 1) : !table.getCanNextPage()}
                        >
                            <ChevronsRight className="h-4 w-4 text-gray-600" />
                        </Button>
                    </div>
                </div>
            </div>
            <div className="rounded-md border border-gray-200 bg-white overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-gray-50/50">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="hover:bg-transparent border-gray-200">
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} className="h-14 text-[13px] font-semibold text-gray-600 first:pl-6 last:pr-6">
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className="hover:bg-gray-50 transition-colors border-gray-100"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="py-2.5 first:pl-6 last:pr-6">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
