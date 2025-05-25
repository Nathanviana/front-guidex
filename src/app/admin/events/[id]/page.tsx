"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save, Trash, Calendar, Clock, MapPin } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import axios from "@/utils/axios"
import type { Event } from "@/hooks/useEvents"

export default function EditEventPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [event, setEvent] = useState<Event | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    location: "",
  })

  // Helper function to format datetime for datetime-local input
  const formatDateTimeLocal = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    const hours = String(date.getHours()).padStart(2, "0")
    const minutes = String(date.getMinutes()).padStart(2, "0")
    return `${year}-${month}-${day}T${hours}:${minutes}`
  }

  // Helper function to determine event status
  const getEventStatus = (startDate: string, endDate: string) => {
    const now = new Date()
    const start = new Date(startDate)
    const end = new Date(endDate)

    if (now < start) return "upcoming"
    if (now > end) return "past"
    return "ongoing"
  }

  // Helper function to calculate event duration
  const getEventDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffInHours = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""}`
    } else {
      const days = Math.floor(diffInHours / 24)
      const hours = diffInHours % 24
      return `${days} day${days !== 1 ? "s" : ""}${hours > 0 ? ` ${hours} hour${hours !== 1 ? "s" : ""}` : ""}`
    }
  }

  // Fetch event data on component mount
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setFetchLoading(true)
        const response = await axios.get(`/events/${params.id}`)
        const eventData = response.data

        setEvent(eventData)
        setFormData({
          name: eventData.name,
          description: eventData.description,
          startDate: formatDateTimeLocal(eventData.startDate),
          endDate: formatDateTimeLocal(eventData.endDate),
          location: eventData.location,
        })
      } catch (err: any) {
        console.error("Error fetching event:", err)
        if (err.response?.status === 404) {
          setError("Event not found")
        } else {
          setError("Failed to load event data")
        }
      } finally {
        setFetchLoading(false)
      }
    }

    fetchEvent()
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
    if (!formData.name || !formData.description || !formData.startDate || !formData.endDate || !formData.location) {
      setError("All fields are required")
      setLoading(false)
      return
    }

    // Date validation
    const startDate = new Date(formData.startDate)
    const endDate = new Date(formData.endDate)

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

      const response = await axios.put(`/events/${params.id}`, eventData)

      if (response.status === 200) {
        setSuccess("Event updated successfully!")

        // Update local event data
        if (event) {
          setEvent({
            ...event,
            ...eventData,
            updatedAt: new Date().toISOString(),
          })
        }

        // Redirect after a short delay to show success message
        setTimeout(() => {
          router.push("/admin/events")
        }, 1500)
      }
    } catch (err: any) {
      console.error("Error updating event:", err)

      if (err.response?.data?.message) {
        setError(err.response.data.message)
      } else if (err.response?.status === 400) {
        setError("Invalid data provided. Please check your inputs.")
      } else if (err.response?.status === 404) {
        setError("Event not found.")
      } else if (err.response?.status === 500) {
        setError("Server error. Please try again later.")
      } else {
        setError("Failed to update event. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
      return
    }

    setLoading(true)
    setError("")

    try {
      await axios.delete(`/events/${params.id}`)
      router.push("/admin/events")
    } catch (err: any) {
      console.error("Error deleting event:", err)
      if (err.response?.status === 404) {
        setError("Event not found.")
      } else {
        setError("Failed to delete event. Please try again.")
      }
      setLoading(false)
    }
  }

  if (fetchLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.push("/admin/events")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">Edit Event</h1>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span>Loading event data...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error && !event) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.push("/admin/events")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">Edit Event</h1>
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
        <Button variant="outline" size="icon" onClick={() => router.push("/admin/events")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Edit Event</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Event Info Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Event Info
            </CardTitle>
            <CardDescription>Current event details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {event && (
              <>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">ID</p>
                  <p className="text-sm">{event.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Duration
                  </p>
                  <p className="text-sm">{getEventDuration(event.startDate, event.endDate)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    Location
                  </p>
                  <p className="text-sm">{event.location}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Created</p>
                  <p className="text-sm">{new Date(event.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                  <p className="text-sm">{new Date(event.updatedAt).toLocaleDateString()}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Edit Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Edit Event</CardTitle>
            <CardDescription>Update the event information</CardDescription>
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
                  <h4 className="font-medium mb-2">Updated Event Preview</h4>
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
                <Button variant="outline" type="button" onClick={() => router.push("/admin/events")} disabled={loading}>
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
                      Update Event
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
