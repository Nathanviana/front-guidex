"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save, Calendar } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"
import axios from "@/utils/axios"

export default function AddEventPage() {
  const router = useRouter()
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    location: "",
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
    if (!formData.name || !formData.description || !formData.startDate || !formData.endDate || !formData.location) {
      setError("All fields are required")
      setLoading(false)
      return
    }

    // Date validation
    const startDate = new Date(formData.startDate)
    const endDate = new Date(formData.endDate)
    const now = new Date()

    if (startDate < now) {
      setError("Start date cannot be in the past")
      setLoading(false)
      return
    }

    if (endDate <= startDate) {
      setError("End date must be after start date")
      setLoading(false)
      return
    }

    try {
      // Convert dates to ISO format for API
      const eventData = {
        ...formData,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
      }

      const response = await axios.post("/events", eventData)

      if (response.status === 201 || response.status === 200) {
        setSuccess("Event created successfully!")

        // Reset form
        setFormData({
          name: "",
          description: "",
          startDate: "",
          endDate: "",
          location: "",
        })

        // Redirect after a short delay to show success message
        setTimeout(() => {
          router.push("/admin/events")
        }, 1500)
      }
    } catch (err: any) {
      console.error("Error creating event:", err)

      if (err.response?.data?.message) {
        setError(err.response.data.message)
      } else if (err.response?.status === 400) {
        setError("Invalid data provided. Please check your inputs.")
      } else if (err.response?.status === 500) {
        setError("Server error. Please try again later.")
      } else {
        setError("Failed to create event. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  // Helper function to format datetime-local input
  const formatDateTimeLocal = (date: string) => {
    if (!date) return ""
    const d = new Date(date)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, "0")
    const day = String(d.getDate()).padStart(2, "0")
    const hours = String(d.getHours()).padStart(2, "0")
    const minutes = String(d.getMinutes()).padStart(2, "0")
    return `${year}-${month}-${day}T${hours}:${minutes}`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.push("/admin/events")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Add New Event</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Event Information
            </CardTitle>
            <CardDescription>Enter the details for the new event</CardDescription>
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
                Event Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Welcome Party for New Students"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
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
                placeholder="Join us for an exciting welcome party where new students can meet each other and learn about campus life..."
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                required
                disabled={loading}
                rows={4}
              />
              <p className="text-sm text-muted-foreground">
                Provide a detailed description of the event, including activities and what attendees can expect.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">
                  Start Date & Time <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="startDate"
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={(e) => handleChange("startDate", e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">
                  End Date & Time <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="endDate"
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={(e) => handleChange("endDate", e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">
                Location <span className="text-red-500">*</span>
              </Label>
              <Input
                id="location"
                placeholder="University Main Hall, Building A, Room 101"
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
                required
                disabled={loading}
              />
              <p className="text-sm text-muted-foreground">
                Specify the exact location where the event will take place.
              </p>
            </div>

            {/* Event Preview */}
            {formData.name && formData.startDate && formData.endDate && (
              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">Event Preview</h4>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="font-medium">Event:</span> {formData.name}
                  </p>
                  {formData.startDate && (
                    <p>
                      <span className="font-medium">Start:</span> {new Date(formData.startDate).toLocaleString()}
                    </p>
                  )}
                  {formData.endDate && (
                    <p>
                      <span className="font-medium">End:</span> {new Date(formData.endDate).toLocaleString()}
                    </p>
                  )}
                  {formData.location && (
                    <p>
                      <span className="font-medium">Location:</span> {formData.location}
                    </p>
                  )}
                  {formData.startDate && formData.endDate && (
                    <p>
                      <span className="font-medium">Duration:</span>{" "}
                      {Math.round(
                        (new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) /
                          (1000 * 60 * 60),
                      )}{" "}
                      hours
                    </p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.push("/admin/events")} disabled={loading}>
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
                  Create Event
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
