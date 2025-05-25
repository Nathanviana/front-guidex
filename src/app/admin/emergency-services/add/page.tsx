"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, LifeBuoy, Phone, MapPin } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"
import axios from "@/utils/axios"

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

export default function AddEmergencyServicePage() {
  const router = useRouter()
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

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

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const validatePhoneNumber = (phone: string) => {
    // Basic phone number validation (allows various formats)
    const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
    const cleanPhone = phone.replace(/[\s\-$$$$]/g, "")
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
      const response = await axios.post("/emergency-services", formData)

      if (response.status === 201 || response.status === 200) {
        setSuccess("Emergency service created successfully!")

        // Reset form
        setFormData({
          serviceName: "",
          phoneNumber: "",
          address: "",
          type: "",
          description: "",
          website: "",
          email: "",
          operatingHours: "",
        })

        // Redirect after a short delay to show success message
        setTimeout(() => {
          router.push("/admin/emergency-services")
        }, 1500)
      }
    } catch (err: any) {
      console.error("Error creating emergency service:", err)

      if (err.response?.data?.message) {
        setError(err.response.data.message)
      } else if (err.response?.status === 400) {
        setError("Invalid data provided. Please check your inputs.")
      } else if (err.response?.status === 409) {
        setError("A service with this phone number already exists.")
      } else if (err.response?.status === 500) {
        setError("Server error. Please try again later.")
      } else {
        setError("Failed to create emergency service. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  const selectedServiceType = serviceTypes.find((type) => type.value === formData.type)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.push("/admin/emergency-services")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Add New Emergency Service</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LifeBuoy className="h-5 w-5" />
              Emergency Service Information
            </CardTitle>
            <CardDescription>Enter the details for the new emergency service contact</CardDescription>
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

              <div className="space-y-2">
                <Label htmlFor="email">Email (optional)</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="contact@hospital.com"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  disabled={loading}
                />
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="website">Website (optional)</Label>
                <Input
                  id="website"
                  placeholder="https://www.hospital.com"
                  value={formData.website}
                  onChange={(e) => handleChange("website", e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="operatingHours">Operating Hours (optional)</Label>
                <Input
                  id="operatingHours"
                  placeholder="24/7 or Mon-Fri 8AM-6PM"
                  value={formData.operatingHours}
                  onChange={(e) => handleChange("operatingHours", e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Service Preview */}
            {formData.serviceName && formData.type && (
              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  {selectedServiceType && <span>{selectedServiceType.icon}</span>}
                  Service Preview
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

            {/* Emergency Contact Card */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-medium text-red-800 mb-2 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Important Note
              </h4>
              <p className="text-sm text-red-700">
                Please verify all contact information before adding. Incorrect emergency contact details could be
                life-threatening. Always test phone numbers and confirm addresses.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.push("/admin/emergency-services")} disabled={loading}>
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
                  Create Emergency Service
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}