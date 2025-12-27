import { Customer } from "@/types/customer";

const API_BASE_URL = process.env.NEXT_PUBLIC_SITE_PINS_API_BASE_URL;
const API_TOKEN = process.env.NEXT_PUBLIC_SITE_PINS_API_TOKEN;

export async function fetchCustomers(page = 1, limit = 20): Promise<{ result: Customer[]; meta: { total: number } }> {
    if (!API_BASE_URL || !API_TOKEN) {
        console.error("API configuration missing", { API_BASE_URL, API_TOKEN });
        return { result: [], meta: { total: 0 } };
    }

    try {
        const response = await fetch(`${API_BASE_URL}/token/users?page=${page}&limit=${limit}`, {
            headers: {
                "Authorization": `Bearer ${API_TOKEN}`,
                "Accept": "application/json",
            },
            next: { revalidate: 3600 } // Cache for 1 hour
        });

        if (!response.ok) {
            throw new Error(`API fetch failed: ${response.statusText}`);
        }

        const data = await response.json();
        return {
            result: data.result || [],
            meta: data.meta || { total: 0 }
        };
    } catch (error) {
        console.error("Error fetching customers:", error);
        return { result: [], meta: { total: 0 } };
    }
}

export async function fetchUserLog(userId: string) {
    if (!API_BASE_URL || !API_TOKEN) return { result: [] };
    try {
        const response = await fetch(`${API_BASE_URL}/token/user-log/${userId}`, {
            headers: {
                "Authorization": `Bearer ${API_TOKEN}`,
                "Accept": "application/json",
            }
        });
        if (!response.ok) throw new Error("Failed to fetch user log");
        return await response.json();
    } catch (error) {
        console.error("Error fetching user log:", error);
        return { result: [] };
    }
}

export async function fetchUserOrganizations(userId: string) {
    if (!API_BASE_URL || !API_TOKEN) return { result: [] };
    try {
        const response = await fetch(`${API_BASE_URL}/token/organization/user?userId=${userId}`, {
            headers: {
                "Authorization": `Bearer ${API_TOKEN}`,
                "Accept": "application/json",
            }
        });
        if (!response.ok) throw new Error("Failed to fetch organizations");
        return await response.json();
    } catch (error) {
        console.error("Error fetching organizations:", error);
        return { result: [] };
    }
}

export async function fetchUserProjects(userId: string) {
    if (!API_BASE_URL || !API_TOKEN) return { result: [] };
    try {
        // Projects guide says forwards req.query, assuming ownerId or userId works
        const response = await fetch(`${API_BASE_URL}/token/projects?ownerId=${userId}`, {
            headers: {
                "Authorization": `Bearer ${API_TOKEN}`,
                "Accept": "application/json",
            }
        });
        if (!response.ok) throw new Error("Failed to fetch projects");
        return await response.json();
    } catch (error) {
        console.error("Error fetching projects:", error);
        return { result: [] };
    }
}

