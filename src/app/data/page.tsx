import { fetchCustomers, fetchUserLog } from "@/lib/api"
import { Database, Code2, Info, CheckCircle2 } from "lucide-react"

export default async function DataExplorerPage() {
    // Fetch a sample user to show real data structure
    const { result: customers } = await fetchCustomers(1, 1)
    const sampleUser = customers?.[0]
    let sampleLog = null

    if (sampleUser?._id) {
        const logData = await fetchUserLog(sampleUser._id)
        sampleLog = logData.result?.[0]
    }

    const dataCategories = [
        {
            title: "User Demographics",
            description: "Core identity and geographical data for every registered user.",
            fields: ["_id", "full_name", "email", "country", "createdAt"],
            icon: CheckCircle2,
            color: "text-blue-500"
        },
        {
            title: "Engagement Logs",
            description: "Real-time records of user actions like logins and page visits.",
            fields: ["userId", "event", "timestamp", "metadata"],
            icon: CheckCircle2,
            color: "text-green-500"
        },
        {
            title: "Business Infrastructure",
            description: "Mapping of users to organizations and technical projects.",
            fields: ["orgId", "projectId", "status", "source"],
            icon: CheckCircle2,
            color: "text-purple-500"
        }
    ]

    return (
        <div className="max-w-5xl space-y-8 pb-20">
            {/* Header */}
            <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                        <Database className="w-6 h-6" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">API Data Explorer</h1>
                </div>
                <p className="text-muted-foreground text-lg">
                    A technical overview of the live data schemas provided by the SitePins API.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {dataCategories.map((cat, i) => (
                    <div key={i} className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm space-y-4">
                        <div className={`flex items-center gap-2 font-bold ${cat.color}`}>
                            <cat.icon className="w-4 h-4" />
                            <span className="text-sm">{cat.title}</span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            {cat.description}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                            {cat.fields.map(f => (
                                <code key={f} className="text-[10px] bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
                                    {f}
                                </code>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Example Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 font-bold text-gray-900">
                    <Code2 className="w-5 h-5" />
                    <h2>Live Data Example (User Object)</h2>
                </div>

                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
                    <div className="relative bg-[#1e1e1e] rounded-2xl overflow-hidden border border-gray-800 shadow-2xl">
                        <div className="flex items-center justify-between px-6 py-3 border-b border-white/5 bg-white/5">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/30"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/30"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/30"></div>
                            </div>
                            <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500">JSON Response</span>
                        </div>
                        <pre className="p-8 text-sm font-mono leading-relaxed overflow-x-auto text-blue-300">
                            {JSON.stringify(sampleUser || {
                                "_id": "676eba21edde4f07a2ec3b7b",
                                "full_name": "Salman Asad",
                                "email": "salman@osmsec.xyz",
                                "country": "India",
                                "createdAt": "2024-12-27T14:15:30.224Z"
                            }, null, 4)}
                        </pre>
                    </div>
                </div>
            </div>

            {/* Log Example Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 font-bold text-gray-900">
                    <Code2 className="w-5 h-5" />
                    <h2>Live Data Example (User Activity Log)</h2>
                </div>

                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
                    <div className="relative bg-[#1e1e1e] rounded-2xl overflow-hidden border border-gray-800 shadow-2xl">
                        <div className="flex items-center justify-between px-6 py-3 border-b border-white/5 bg-white/5">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/30"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/30"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/30"></div>
                            </div>
                            <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500">JSON Response</span>
                        </div>
                        <pre className="p-8 text-sm font-mono leading-relaxed overflow-x-auto text-green-300">
                            {JSON.stringify(sampleLog || {
                                "userId": "676eba21edde4f07a2ec3b7b",
                                "event": "Login to Dashboard",
                                "timestamp": "2024-12-27T14:15:30.224Z"
                            }, null, 4)}
                        </pre>
                    </div>
                </div>
            </div>

            {/* API Status Info */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex gap-4 items-start">
                <div className="p-2 bg-blue-500 rounded-full text-white shrink-0">
                    <Info className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                    <h3 className="font-bold text-blue-900 text-sm">System Integration Note</h3>
                    <p className="text-xs text-blue-700 leading-relaxed">
                        This data is fetched in real-time from the SitePins Token API. All unique IDs are indexed for fast lookup across User Logs, Organizations, and Project repositories.
                    </p>
                </div>
            </div>
        </div>
    )
}
