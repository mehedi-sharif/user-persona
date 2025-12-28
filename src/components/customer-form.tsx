"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
    Brain,
    Save,
    Plus,
    X,
    Sparkles,
    Loader2
} from "lucide-react"
import { Customer, CustomerInsert } from "@/types/customer"

interface CustomerFormProps {
    initialData?: Customer
}

export function CustomerForm({ initialData }: CustomerFormProps) {
    const router = useRouter()
    const supabase = createClient()
    const [loading, setLoading] = useState(false)

    const [formData, setFormData] = useState<CustomerInsert>({
        full_name: initialData?.full_name || "",
        email: initialData?.email || "",
        job_title: initialData?.job_title || undefined,
        company: initialData?.company || undefined,
        industry: initialData?.industry || undefined,
        linkedin_profile: initialData?.linkedin_profile || undefined,
        phone: initialData?.phone || undefined,
        website: initialData?.website || undefined,
        bio: initialData?.bio || undefined,
        raw_notes: initialData?.raw_notes || undefined,
        pain_points: initialData?.pain_points || [],
        goals: initialData?.goals || [],
        persona_summary: initialData?.persona_summary || undefined,
        image: initialData?.image || undefined,
        country: initialData?.country || undefined,
        api_user_id: initialData?.api_user_id || undefined,
    })

    const [newPainPoint, setNewPainPoint] = useState("")
    const [newGoal, setNewGoal] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            // Prepare data for Supabase
            const dataToSave = {
                ...formData,
                api_user_id: initialData?._id || formData.api_user_id, // Use API ID as reference
            }

            // Check if record exists
            const { data: existing } = await supabase
                .from("customers")
                .select("id")
                .eq("api_user_id", dataToSave.api_user_id)
                .single()

            if (existing) {
                // Update existing record
                const { error } = await supabase
                    .from("customers")
                    .update(dataToSave)
                    .eq("api_user_id", dataToSave.api_user_id)
                if (error) throw error
            } else {
                // Insert new record
                const { error } = await supabase
                    .from("customers")
                    .insert([dataToSave])
                if (error) throw error
            }

            router.push("/customers")
            router.refresh()
        } catch (error) {
            console.error("Error saving customer:", error)
            alert("Error saving customer. Check console for details and ensure Supabase is connected.")
        } finally {
            setLoading(false)
        }
    }

    const addPainPoint = () => {
        if (newPainPoint.trim()) {
            setFormData(prev => ({ ...prev, pain_points: [...(prev.pain_points || []), newPainPoint.trim()] }))
            setNewPainPoint("")
        }
    }

    const removePainPoint = (index: number) => {
        setFormData(prev => ({
            ...prev,
            pain_points: (prev.pain_points || []).filter((_, i) => i !== index),
        }))
    }

    const addGoal = () => {
        if (newGoal.trim()) {
            setFormData(prev => ({ ...prev, goals: [...(prev.goals || []), newGoal.trim()] }))
            setNewGoal("")
        }
    }

    const removeGoal = (index: number) => {
        setFormData(prev => ({
            ...prev,
            goals: (prev.goals || []).filter((_, i) => i !== index),
        }))
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 pb-20">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">
                    {initialData ? `Edit ${initialData.full_name}` : "Add New Customer"}
                </h1>
                <div className="flex gap-3">
                    <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                    <Button type="submit" disabled={loading} className="gap-2">
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {initialData ? "Save Changes" : "Create Customer"}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Basic Info */}
                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                            <CardDescription>Core demographics and contact info.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    value={formData.full_name}
                                    onChange={e => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                                    placeholder="e.g. Sarah J. Mitchell"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                    placeholder="sarah@example.com"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="job_title">Job Title</Label>
                                <Input
                                    id="job_title"
                                    value={formData.job_title || ""}
                                    onChange={e => setFormData(prev => ({ ...prev, job_title: e.target.value }))}
                                    placeholder="e.g. Senior Marketing Manager"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="company">Company</Label>
                                <Input
                                    id="company"
                                    value={formData.company || ""}
                                    onChange={e => setFormData(prev => ({ ...prev, company: e.target.value }))}
                                    placeholder="e.g. Acme Corp"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="industry">Industry</Label>
                                <Input
                                    id="industry"
                                    value={formData.industry || ""}
                                    onChange={e => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                                    placeholder="e.g. SaaS, Healthcare, Finance"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="linkedin">LinkedIn Profile</Label>
                                <Input
                                    id="linkedin"
                                    value={formData.linkedin_profile || ""}
                                    onChange={e => setFormData(prev => ({ ...prev, linkedin_profile: e.target.value }))}
                                    placeholder="https://linkedin.com/in/username"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    value={formData.phone || ""}
                                    onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                    placeholder="+1 (555) 123-4567"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="website">Website</Label>
                                <Input
                                    id="website"
                                    type="url"
                                    value={formData.website || ""}
                                    onChange={e => setFormData(prev => ({ ...prev, website: e.target.value }))}
                                    placeholder="https://example.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="country">Country</Label>
                                <Input
                                    id="country"
                                    value={formData.country || ""}
                                    onChange={e => setFormData(prev => ({ ...prev, country: e.target.value }))}
                                    placeholder="e.g. United States"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="bio">Bio</Label>
                                <Textarea
                                    id="bio"
                                    value={formData.bio || ""}
                                    onChange={e => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                                    placeholder="Short bio or description..."
                                    className="min-h-[80px]"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-primary/20 bg-primary/5">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-primary" /> Persona Analysis
                            </CardTitle>
                            <CardDescription>Generated summary based on research.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="summary">Persona Summary</Label>
                                <Textarea
                                    id="summary"
                                    className="min-h-[200px] border-primary/10 transition-all focus:border-primary"
                                    value={formData.persona_summary || ""}
                                    onChange={e => setFormData(prev => ({ ...prev, persona_summary: e.target.value }))}
                                    placeholder="The AI will generate this once you save..."
                                />
                            </div>
                            <Button type="button" variant="outline" className="w-full gap-2 border-primary/20 text-primary">
                                <Brain className="w-4 h-4" /> Generate with AI
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Deep Research */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Brain className="w-5 h-5 text-primary" /> Raw Research Input
                            </CardTitle>
                            <CardDescription>
                                Paste interview transcripts, customer feedback, or raw field notes.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                className="min-h-[300px] font-mono text-sm leading-relaxed"
                                value={formData.raw_notes || ""}
                                onChange={e => setFormData(prev => ({ ...prev, raw_notes: e.target.value }))}
                                placeholder="--- Research Session: Oct 2023 ---&#10;Customer mentioned they struggle with..."
                            />
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-md font-semibold">Pain Points</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Add pain point..."
                                        value={newPainPoint}
                                        onChange={e => setNewPainPoint(e.target.value)}
                                        onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addPainPoint())}
                                    />
                                    <Button type="button" size="icon" onClick={addPainPoint}>
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>
                                <div className="space-y-2">
                                    {(formData.pain_points || []).map((point, i) => (
                                        <div key={i} className="flex items-center justify-between p-2 rounded-md bg-muted text-sm border border-border/50 group">
                                            <span className="truncate pr-2">{point}</span>
                                            <button
                                                type="button"
                                                onClick={() => removePainPoint(i)}
                                                className="text-muted-foreground hover:text-destructive transition-colors px-1"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                    {(formData.pain_points || []).length === 0 && (
                                        <p className="text-xs text-muted-foreground italic">No pain points added.</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-md font-semibold">Strategic Goals</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Add goal..."
                                        value={newGoal}
                                        onChange={e => setNewGoal(e.target.value)}
                                        onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addGoal())}
                                    />
                                    <Button type="button" size="icon" onClick={addGoal}>
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>
                                <div className="space-y-2">
                                    {(formData.goals || []).map((goal, i) => (
                                        <div key={i} className="flex items-center justify-between p-2 rounded-md bg-muted text-sm border border-border/50">
                                            <span className="truncate pr-2">{goal}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeGoal(i)}
                                                className="text-muted-foreground hover:text-destructive transition-colors px-1"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                    {(formData.goals || []).length === 0 && (
                                        <p className="text-xs text-muted-foreground italic">No goals added.</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </form>
    )
}
