import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { CustomerForm } from "@/components/customer-form"
import { Customer } from "@/types/customer"

export default async function EditCustomerPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params

    // Fetch from API first (since customers come from API)
    const API_BASE_URL = process.env.NEXT_PUBLIC_SITE_PINS_API_BASE_URL
    const API_TOKEN = process.env.NEXT_PUBLIC_SITE_PINS_API_TOKEN

    let customer: Customer | null = null

    if (API_BASE_URL && API_TOKEN) {
        try {
            const response = await fetch(`${API_BASE_URL}/token/users?page=1&limit=500`, {
                headers: {
                    "Authorization": `Bearer ${API_TOKEN}`,
                    "Accept": "application/json",
                },
                next: { revalidate: 0 } // Don't cache for edit page
            })

            if (response.ok) {
                const data = await response.json()
                customer = data.result?.find((u: Customer) => u._id === id) || null
            }
        } catch (error) {
            console.error("Error fetching from API:", error)
        }
    }

    // If customer found in API, try to merge with Supabase data
    if (customer) {
        const supabase = await createClient()
        const { data: supabaseData } = await supabase
            .from('customers')
            .select('*')
            .eq('api_user_id', id)
            .single()

        // Merge API data with Supabase persona data
        if (supabaseData) {
            customer = {
                ...customer,
                ...supabaseData,
                _id: id, // Keep API ID as primary
                api_user_id: id,
            }
        }
    }

    if (!customer) {
        notFound()
    }

    return <CustomerForm initialData={customer} />
}
