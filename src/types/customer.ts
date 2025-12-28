export type Customer = {
    _id: string
    full_name: string
    email: string
    image: string | null
    country: string | null
    createdAt: string
    orders?: any[] // Array of orders for paid customers
    // Keep these for potential future use or transition
    job_title?: string | null
    raw_notes?: string | null
    pain_points?: string[]
    goals?: string[]
    persona_summary?: string | null
}

export type CustomerInsert = Omit<Customer, '_id' | 'createdAt'>
export type CustomerUpdate = Partial<CustomerInsert>
