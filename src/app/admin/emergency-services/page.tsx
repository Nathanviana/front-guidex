import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Edit, LifeBuoy, Plus, Trash } from "lucide-react"

// Mock data for emergency services
const emergencyServices = [
  {
    id: 1,
    serviceName: "City General Hospital",
    phoneNumber: "+1 (555) 123-4567",
    address: "123 Health St, Medical District",
    type: "hospital",
  },
  {
    id: 2,
    serviceName: "Central Police Station",
    phoneNumber: "+1 (555) 987-6543",
    address: "456 Safety Ave, Downtown",
    type: "police",
  },
  {
    id: 3,
    serviceName: "Fire Department Station 3",
    phoneNumber: "+1 (555) 789-0123",
    address: "789 Rescue Rd, Northside",
    type: "fire",
  },
  {
    id: 4,
    serviceName: "University Medical Center",
    phoneNumber: "+1 (555) 234-5678",
    address: "101 Campus Dr, University Area",
    type: "hospital",
  },
  {
    id: 5,
    serviceName: "Emergency Dental Clinic",
    phoneNumber: "+1 (555) 345-6789",
    address: "202 Smile St, Westside",
    type: "dental",
  },
  {
    id: 6,
    serviceName: "Mental Health Crisis Center",
    phoneNumber: "+1 (555) 456-7890",
    address: "303 Wellness Way, Eastside",
    type: "mental health",
  },
  {
    id: 7,
    serviceName: "Poison Control Center",
    phoneNumber: "+1 (555) 567-8901",
    address: "404 Response Blvd, Southside",
    type: "poison control",
  },
]

export default function EmergencyServicesPage() {
  // Count services by type
  const serviceTypes = emergencyServices.reduce(
    (acc, service) => {
      acc[service.type] = (acc[service.type] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Emergency Services</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Service
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Services</CardTitle>
            <LifeBuoy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{emergencyServices.length}</div>
          </CardContent>
        </Card>
        {Object.entries(serviceTypes)
          .slice(0, 3)
          .map(([type, count]) => (
            <Card key={type}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium capitalize">{type}</CardTitle>
                <LifeBuoy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{count}</div>
              </CardContent>
            </Card>
          ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Emergency Services</CardTitle>
          <CardDescription>Manage emergency service contacts</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Address</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {emergencyServices.map((service) => (
                <TableRow key={service.id}>
                  <TableCell className="font-medium">{service.serviceName}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {service.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{service.phoneNumber}</TableCell>
                  <TableCell>{service.address}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
