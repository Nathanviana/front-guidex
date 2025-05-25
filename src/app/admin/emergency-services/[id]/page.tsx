"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Trash, LifeBuoy, Phone, MapPin, Globe, Clock, Mail } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import axios from "@/utils/axios"
import type { EmergencyService } from "@/hooks/useEmergencyServices"

const serviceTypes = [
  { value: "hospital", label: "Hospital", icon: "🏥" },
  { value: "police", label: "Police Station", icon: "👮" },
  { value: "fire", label: "Fire Department", icon: "🚒" },
  { value: "ambulance", label: "Ambulance Service", icon: "🚑" },
  { value: "dental", label: "Dental Emergency", icon: "🦷" },
  { value: "mental health", label: "Mental Health Crisis", icon: "🧠" },
  { value: "poison control", label: "Poison Control", icon: "☠️" },
  { value: "veterinary", label: "Veterinary Emergency", icon: "🐕" },
  { value: "pharmacy", label: "24h Pharmacy", icon: "💊" },
  { value: "other", label: "Other", icon: "🆘" },
]

const serviceTypeConfig = {
  hospital: { label: "Hospital", icon: "🏥", color: "bg-red-50 text-red-700 border-red-200" },
  police: { label: "Police", icon: "👮", color: "bg-blue-50 text-blue-700 border-blue-200" },
  fire: { label: "Fire Dept", icon: "🚒", color: "bg-orange-50 text-orange-700 border-orange-200" },
  ambulance: { label: "Ambulance", icon: "🚑", color: "bg-red-50 text-red-700 border-red-200" },
  dental: { label: "Dental", icon: "🦷", color: "bg-green-50 text-green-700 border-green-200" },
  "mental health": { label: "Mental Health", icon: "🧠", color: "bg-purple-50 text-purple-700 border-purple-200" },
  "poison control": { label: "Poison Control", icon: "☠️", color: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  veterinary: { label: "Veterinary", icon: "🐕", color: "bg-green-50 text-green-700 border-green-200" },
  pharmacy: { label: "Pharmacy", icon: "💊", color: "bg-blue-50 text-blue-700 border-blue-200" },
  other: { label: "Other", icon: "🆘", color: "bg-gray-50 text-gray-700 border-gray-200" },
}

export default function EditEmergencyServicePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [emergencyService, setEmergencyService] = useState<EmergencyService | null>(null)

  const [formData, setFormData] = useState({
    serviceName: "",
    phoneNumber: "",
    address: "",
    type: "",
    description: "",
    website: "",
    email: "",
    operatingHours: "",
  })

  // Fetch emergency service data on component mount
  useEffect(() => {
    const fetchEmergencyService = async () => {
      try {
        setFetchLoading(true)
        const response = await axios.get(`/emergency-services/${params.id}`)
        const serviceData = response.data

        setEmergencyService(serviceData)
        setFormData({
          serviceName: serviceData.serviceName,
          phoneNumber: serviceData.phoneNumber,
          address: serviceData.address,
          type: serviceData.type,
          description: serviceData.description || "",
          website: serviceData.website || "",
          email: serviceData.email || "",
          operatingHours: serviceData.operatingHours || "",
        })
      } catch (err: any) {
        console.error("Error fetching emergency service:", err)
        if (err.response?.status === 404) {
          setError("Emergency service not found")
        } else {
          setError("Failed to load emergency service data")
        }
      } finally {
        setFetchLoading(false)
      }
    }

    fetchEmergencyService()
  }, [params.id])

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const validatePhoneNumber = (phone: string) => {
    // Basic phone number validation (allows various formats)
    const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
    const cleanPhone = phone.replace(/[\s\-()]/g, "")
    return phoneRegex.test(cleanPhone) || phone.includes("+")
  }

  const validateEmail = (email: string) => {
    if (!email) return true // Email is optional
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    // Basic validation
    if (!formData.serviceName || !formData.phoneNumber || !formData.address || !formData.type) {
      setError("Service name, phone number, address, and type are required")
      setLoading(false)
      return
    }

    // Phone number validation
    if (!validatePhoneNumber(formData.phoneNumber)) {
      setError("Please enter a valid phone number")
      setLoading(false)
      return
    }

    // Email validation
    if (!validateEmail(formData.email)) {
      setError("Please enter a valid email address")
      setLoading(false)
      return
    }

    try {
      const response = await axios.put(`/emergency-services/${params.id}`, formData)

      if (response.status === 200) {
        setSuccess("Emergency service updated successfully!")

        // Update local emergency service data
        if (emergencyService) {
          setEmergencyService({
            ...emergencyService,
            ...formData,
            updatedAt: new Date().toISOString(),
          })
        }

        // Redirect after a short delay to show success message
        setTimeout(() => {
          router.push("/admin/emergency-services")
        }, 1500)
      }
    } catch (err: any) {
      console.error("Error updating emergency service:", err)

      if (err.response?.data?.message) {
        setError(err.response.data.message)
      } else if (err.response?.status === 400) {
        setError("Invalid data provided. Please check your inputs.")
      } else if (err.response?.status === 404) {
        setError("Emergency service not found.")
      } else if (err.response?.status === 409) {
        setError("A service with this phone number already exists.")
      } else if (err.response?.status === 500) {
        setError("Server error. Please try again later.")
      } else {
        setError("Failed to update emergency service. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this emergency service? This action cannot be undone.")) {
      return
    }

    setLoading(true)
    setError("")

    try {
      await axios.delete(`/emergency-services/${params.id}`)
      router.push("/admin/emergency-services")
    } catch (err: any) {
      console.error("Error deleting emergency service:", err)
      if (err.response?.status === 404) {
        setError("Emergency service not found.")
      } else {
        setError("Failed to delete emergency service. Please try again.")
      }
      setLoading(false)
    }
  }

  if (fetchLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.push("/admin/emergency-services")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">Edit Emergency Service</h1>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span>Loading emergency service data...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error && !emergencyService) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.push("/admin/emergency-services")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">Edit Emergency Service</h1>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  const selectedServiceType = serviceTypes.find((type) => type.value === formData.type)
  const currentTypeConfig = emergencyService
    ? serviceTypeConfig[emergencyService.type as keyof typeof serviceTypeConfig] || serviceTypeConfig.other
    : null

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.push("/admin/emergency-services")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Edit Emergency Service</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Service Info Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LifeBuoy className="h-5 w-5" />
              Service Info
            </CardTitle>
            <CardDescription>Current service details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {emergencyService && (
              <>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">ID</p>
                  <p className="text-sm">{emergencyService.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Service Type</p>
                  <div className="mt-1">
                    {currentTypeConfig && (
                      <Badge variant="outline" className={currentTypeConfig.color}>
                        <span className="mr-1">{currentTypeConfig.icon}</span>
                        {currentTypeConfig.label}
                      </Badge>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    Phone Number
                  </p>
                  <p className="text-sm font-mono">{emergencyService.phoneNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    Address
                  </p>
                  <p className="text-sm">{emergencyService.address}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Created</p>
                  <p className="text-sm">{new Date(emergencyService.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                  <p className="text-sm">{new Date(emergencyService.updatedAt).toLocaleDateString()}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Edit Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Edit Emergency Service</CardTitle>
            <CardDescription>Update the emergency service information</CardDescription>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="serviceName">
                    Service Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="serviceName"
                    placeholder="City General Hospital"
                    value={formData.serviceName}
                    onChange={(e) => handleChange("serviceName", e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">
                    Service Type <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.type} onValueChange={(value) => handleChange("type", value)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select service type" />
                    </SelectTrigger>
                    <SelectContent>
                      {serviceTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <span>{type.icon}</span>
                            <span>{type.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">
                    <Phone className="inline h-4 w-4 mr-1" />
                    Phone Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phoneNumber"
                    placeholder="+1 (555) 123-4567"
                    value={formData.phoneNumber}
                    onChange={(e) => handleChange("phoneNumber", e.target.value)}
                    required
                    disabled={loading}
                  />
                  <p className="text-sm text-muted-foreground">Include country code for international numbers</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">
                  <MapPin className="inline h-4 w-4 mr-1" />
                  Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="address"
                  placeholder="123 Health Street, Medical District, City, State"
                  value={formData.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  required
                  disabled={loading}
                />
                <p className="text-sm text-muted-foreground">Provide the complete address including city and state</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of services provided, specialties, or additional information..."
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  disabled={loading}
                  rows={3}
                />
                <p className="text-sm text-muted-foreground">
                  Include any special services, languages spoken, or important notes
                </p>
              </div>

              {/* Service Preview */}
              {formData.serviceName && formData.type && (
                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    {selectedServiceType && <span>{selectedServiceType.icon}</span>}
                    Updated Service Preview
                  </h4>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="font-medium">Service:</span> {formData.serviceName}
                    </p>
                    <p>
                      <span className="font-medium">Type:</span> {selectedServiceType?.label}
                    </p>
                    {formData.phoneNumber && (
                      <p>
                        <span className="font-medium">Phone:</span> {formData.phoneNumber}
                      </p>
                    )}
                    {formData.address && (
                      <p>
                        <span className="font-medium">Address:</span> {formData.address}
                      </p>
                    )}
                    {formData.operatingHours && (
                      <p>
                        <span className="font-medium">Hours:</span> {formData.operatingHours}
                      </p>
                    )}
                    {formData.email && (
                      <p>
                        <span className="font-medium">Email:</span> {formData.email}
                      </p>
                    )}
                    {formData.website && (
                      <p>
                        <span className="font-medium">Website:</span> {formData.website}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Emergency Contact Warning */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-medium text-red-800 mb-2 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Important Note
                </h4>
                <p className="text-sm text-red-700">
                  Please verify all contact information before updating. Incorrect emergency contact details could be
                  life-threatening. Always test phone numbers and confirm addresses.
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
                  onClick={() => router.push("/admin/emergency-services")}
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
                      Update Service
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
