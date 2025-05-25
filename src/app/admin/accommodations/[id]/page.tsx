"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Save, Trash } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"
import axios from "@/utils/axios"
import type { Accommodation } from "@/hooks/useAccommodations"

export default function EditAccommodationPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [accommodation, setAccommodation] = useState<Accommodation | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    description: "",
    availability: true,
  })

  // Fetch accommodation data on component mount
  useEffect(() => {
    const fetchAccommodation = async () => {
      try {
        setFetchLoading(true)
        const response = await axios.get(`/accommodations/${params.id}`)
        const accommodationData = response.data

        setAccommodation(accommodationData)
        setFormData({
          name: accommodationData.name,
          address: accommodationData.address,
          description: accommodationData.description,
          availability: accommodationData.availability,
        })
      } catch (err: any) {
        console.error("Error fetching accommodation:", err)
        if (err.response?.status === 404) {
          setError("Accommodation not found")
        } else {
          setError("Failed to load accommodation data")
        }
      } finally {
        setFetchLoading(false)
      }
    }

    fetchAccommodation()
  }, [params.id])

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
      const response = await axios.put(`/accommodations/${params.id}`, formData)

      if (response.status === 200) {
        setSuccess("Accommodation updated successfully!")

        // Update local accommodation data
        if (accommodation) {
          setAccommodation({
            ...accommodation,
            ...formData,
            updatedAt: new Date().toISOString(),
          })
        }

        // Redirect after a short delay to show success message
        setTimeout(() => {
          router.push("/admin/accommodations")
        }, 1500)
      }
    } catch (err: any) {
      console.error("Error updating accommodation:", err)

      if (err.response?.data?.message) {
        setError(err.response.data.message)
      } else if (err.response?.status === 400) {
        setError("Invalid data provided. Please check your inputs.")
      } else if (err.response?.status === 404) {
        setError("Accommodation not found.")
      } else if (err.response?.status === 500) {
        setError("Server error. Please try again later.")
      } else {
        console.error("Unexpected error:", err)
        setError("Failed to update accommodation. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this accommodation? This action cannot be undone.")) {
      return
    }

    setLoading(true)
    setError("")

    try {
      await axios.delete(`/accommodations/${params.id}`)
      router.push("/admin/accommodations")
    } catch (err: any) {
      console.error("Error deleting accommodation:", err)
      if (err.response?.status === 404) {
        setError("Accommodation not found.")
      } else {
        setError("Failed to delete accommodation. Please try again.")
      }
      setLoading(false)
    }
  }

  if (fetchLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.push("/admin/accommodations")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">Edit Accommodation</h1>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span>Loading accommodation data...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error && !accommodation) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.push("/admin/accommodations")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">Edit Accommodation</h1>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.push("/admin/accommodations")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Edit Accommodation</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Accommodation Info Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Accommodation Info</CardTitle>
            <CardDescription>Current accommodation details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {accommodation && (
              <>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">ID</p>
                  <p className="text-sm">{accommodation.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Created</p>
                  <p className="text-sm">{new Date(accommodation.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                  <p className="text-sm">{new Date(accommodation.updatedAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Current Status</p>
                  <div className="mt-1">
                    {accommodation.availability ? (
                      <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                        Available
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">
                        Occupied
                      </span>
                    )}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Edit Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Edit Accommodation</CardTitle>
            <CardDescription>Update the accommodation information</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
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
              <Button variant="destructive" type="button" onClick={handleDelete} disabled={loading}>
                {loading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-foreground" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                  </>
                )}
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => router.push("/admin/accommodations")}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-foreground" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Update Accommodation
                    </>
                  )}
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
