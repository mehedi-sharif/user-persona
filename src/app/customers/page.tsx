import { fetchCustomers } from "@/lib/api"
import { DataTable } from "@/components/data-table"
import { columns } from "./columns"
import { Suspense } from "react"

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function CustomersPage(props: {
    searchParams: SearchParams
}) {
    const searchParams = await props.searchParams
    const page = Number(searchParams.page) || 1
    const limit = 100
    const { result: customers, meta } = await fetchCustomers(page, limit)

    return (
        <div className="py-6 space-y-4">
            <Suspense fallback={<div className="h-24 animate-pulse bg-gray-50 rounded-lg" />}>
                <DataTable
                    columns={columns}
                    data={customers || []}
                    pageCount={Math.ceil((meta?.total || 0) / limit)}
                    currentPage={page}
                />
            </Suspense>
        </div>
    )
}
