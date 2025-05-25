"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Save } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"
import axios from "@/utils/axios"

export default function AddAccommodationPage() {
  const router = useRouter()
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    description: "",
    availability: true,
  })

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    // Basic validation
    if (!formData.name || !formData.address || !formData.description) {
      setError("Name, address, and description are required")
      setLoading(false)
      return
    }

    try {
      const response = await axios.post("/accommodations", formData)

      if (response.status === 201 || response.status === 200) {
        setSuccess("Accommodation created successfully!")

        // Reset form
        setFormData({
          name: "",
          address: "",
          description: "",
          availability: true,
        })

        // Redirect after a short delay to show success message
        setTimeout(() => {
          router.push("/admin/accommodations")
        }, 1500)
      }
    } catch (err: any) {
      console.error("Error creating accommodation:", err)

      if (err.response?.data?.message) {
        setError(err.response.data.message)
      } else if (err.response?.status === 400) {
        setError("Invalid data provided. Please check your inputs.")
      } else if (err.response?.status === 500) {
        setError("Server error. Please try again later.")
      } else {
        setError("Failed to create accommodation. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.push("/admin/accommodations")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Add New Accommodation</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Accommodation Information</CardTitle>
            <CardDescription>Enter the details for the new accommodation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">{success}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Cozy Apartment Downtown"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">
                Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="address"
                placeholder="123 Main Street, City, State"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                placeholder="A comfortable and well-located accommodation with modern amenities..."
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                required
                disabled={loading}
                rows={4}
              />
              <p className="text-sm text-muted-foreground">
                Provide a detailed description of the accommodation, including amenities and features.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="availability">Available</Label>
                <Switch
                  id="availability"
                  checked={formData.availability}
                  onCheckedChange={(checked) => handleChange("availability", checked)}
                  disabled={loading}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Set whether this accommodation is currently available for booking
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.push("/admin/accommodations")} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-foreground" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Create Accommodation
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}