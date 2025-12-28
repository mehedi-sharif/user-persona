export type Customer = {
    _id: string
    id?: string // Supabase UUID (optional for API-only customers)
    api_user_id?: string // Reference to API user ID
    full_name: string
    email: string
    image?: string
    country?: string
    createdAt: string
    orders?: any[] // Array of orders for paid customers

    // Persona fields
    job_title?: string
    company?: string
    industry?: string
    linkedin_profile?: string
    phone?: string
    website?: string
    bio?: string

    // Research data
    raw_notes?: string
    pain_points?: string[]
    goals?: string[]
    persona_summary?: string

    // Timestamps
    last_researched?: string
    updated_at?: string
}

export type CustomerInsert = Omit<Customer, '_id' | 'id' | 'createdAt' | 'updated_at'>
export type CustomerUpdate = Partial<CustomerInsert>
