import { fetchCustomers } from "@/lib/api"
import { DataTable } from "@/components/data-table"
import { columns } from "./columns"
import { Button } from "@/components/ui/button"
import { Plus, Download } from "lucide-react"
import Link from "next/link"

export default async function CustomersPage() {
    const { result: customers } = await fetchCustomers(1, 1000)

    return (
        <div className="py-6">

            <DataTable columns={columns} data={customers || []} />
        </div>
    )
}
