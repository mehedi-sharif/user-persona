import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"

// Force re-deploy to fix stale cache
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Brain,
    Target,
    Zap,
    FileText,
    Calendar,
    Mail,
    Briefcase,
    Edit
} from "lucide-react"
import Link from "next/link"

export default async function CustomerDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const supabase = await createClient()

    const { data: customer } = await supabase
        .from('customers')
        .select('*')
        .eq('id', id)
        .single() as { data: import("@/types/customer").Customer | null }

    if (!customer) {
        notFound()
    }

    return (
        <div className="space-y-8 pb-12">
            <div className="flex items-start justify-between">
                <div className="flex gap-6 items-center">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center border border-primary/20 shadow-inner">
                        <Brain className="w-10 h-10 text-primary" />
                    </div>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-4xl font-bold tracking-tight">{customer.full_name}</h1>
                            <Badge variant="outline" className="h-6">Persona ID: {customer._id.slice(0, 8)}</Badge>
                        </div>
                        <p className="text-xl text-muted-foreground font-medium mt-1">{customer.job_title || "Strategic Consultant"}</p>
                        <div className="flex gap-4 mt-3">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Mail className="w-4 h-4" />
                                {customer.email}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="w-4 h-4" />
                                Updated {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : 'Never'}
                            </div>
                        </div>
                    </div>
                </div>
                <Button asChild variant="outline" className="gap-2">
                    <Link href={`/customers/${id}/edit`}>
                        <Edit className="w-4 h-4" /> Edit Persona
                    </Link>
                </Button>
            </div>

            <Tabs defaultValue="overview" className="space-y-8">
                <TabsList className="bg-card/50 border h-12 p-1">
                    <TabsTrigger value="overview" className="px-8 flex gap-2">
                        <LayoutDashboard className="w-4 h-4" /> Overview
                    </TabsTrigger>
                    <TabsTrigger value="psychographics" className="px-8 flex gap-2">
                        <Target className="w-4 h-4" /> Psychographics
                    </TabsTrigger>
                    <TabsTrigger value="notes" className="px-8 flex gap-2">
                        <FileText className="w-4 h-4" /> Research Notes
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                    <Card className="border-none shadow-xl bg-gradient-to-br from-card to-accent/5 overflow-hidden">
                        <CardHeader className="border-b bg-muted/30 pb-4">
                            <div className="flex items-center gap-2 text-primary">
                                <Brain className="w-5 h-5" />
                                <CardTitle className="text-lg">Persona Summary</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <p className="text-lg leading-relaxed text-muted-foreground italic">
                                "{customer.persona_summary || "No summary generated yet. Add research notes and click 'Generate Persona' to populate this field."}"
                            </p>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="bg-card/30 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-md flex items-center gap-2">
                                    <Zap className="w-4 h-4 text-orange-500" /> Key Pain Points
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3">
                                    {customer.pain_points?.length ? customer.pain_points.map((point: string, i: number) => (
                                        <li key={i} className="flex gap-3 text-sm p-3 rounded-lg bg-red-500/5 border border-red-500/10">
                                            <span className="font-semibold text-red-500">•</span>
                                            {point}
                                        </li>
                                    )) : (
                                        <li className="text-sm text-muted-foreground">No pain points identified.</li>
                                    )}
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="bg-card/30 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-md flex items-center gap-2">
                                    <Target className="w-4 h-4 text-green-500" /> Strategic Goals
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3">
                                    {customer.goals?.length ? customer.goals.map((goal: string, i: number) => (
                                        <li key={i} className="flex gap-3 text-sm p-3 rounded-lg bg-green-500/5 border border-green-500/10">
                                            <span className="font-semibold text-green-500">•</span>
                                            {goal}
                                        </li>
                                    )) : (
                                        <li className="text-sm text-muted-foreground">No goals defined yet.</li>
                                    )}
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="psychographics">
                    <Card>
                        <CardHeader>
                            <CardTitle>Detailed Psychographics</CardTitle>
                            <CardDescription>Behavioral patterns and decision-making drivers.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-12 text-center text-muted-foreground border-t bg-muted/10">
                            <div className="max-w-md mx-auto space-y-4">
                                <div className="p-4 bg-muted rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                                    <Target className="w-8 h-8 opacity-50" />
                                </div>
                                <p>Psychographic mapping allows you to understand the "Why" behind {customer.full_name}'s actions. Complete the research form to see details here.</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="notes">
                    <Card className="bg-card/50">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Raw Research Logs</CardTitle>
                                <CardDescription>Historical data and interview snippets.</CardDescription>
                            </div>
                            <Button variant="ghost" size="sm">Download Logs</Button>
                        </CardHeader>
                        <CardContent className="border-t pt-6">
                            <pre className="whitespace-pre-wrap text-sm font-mono p-6 bg-muted/50 rounded-xl leading-relaxed">
                                {customer.raw_notes || "No research data available for this customer."}
                            </pre>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

// Helper icons that were missing in the imports but used
import { LayoutDashboard as LayoutIcon } from "lucide-react"
const LayoutDashboard = LayoutIcon
