import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Building2, Edit, Plus, Trash } from "lucide-react"

// Mock data for accommodations
const accommodations = [
  {
    id: 1,
    name: "Cozy Apartment",
    address: "123 Main St, City",
    description: "A comfortable apartment in the city center",
    availability: true,
    createdAt: "2023-05-15T10:00:00Z",
  },
  {
    id: 2,
    name: "Luxury Villa",
    address: "456 Ocean Ave, Beach City",
    description: "Spacious villa with ocean view",
    availability: false,
    createdAt: "2023-06-20T14:30:00Z",
  },
  {
    id: 3,
    name: "Student Dorm",
    address: "789 University Blvd, College Town",
    description: "Affordable dorm for students",
    availability: true,
    createdAt: "2023-07-10T09:15:00Z",
  },
  {
    id: 4,
    name: "Downtown Loft",
    address: "101 Urban St, Metro City",
    description: "Modern loft in the heart of downtown",
    availability: true,
    createdAt: "2023-08-05T16:45:00Z",
  },
  {
    id: 5,
    name: "Countryside Cottage",
    address: "202 Rural Rd, Green Valley",
    description: "Peaceful cottage surrounded by nature",
    availability: false,
    createdAt: "2023-09-12T11:20:00Z",
  },
]

export default function AccommodationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Accommodations</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Accommodation
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{accommodations.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{accommodations.filter((a) => a.availability).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupied</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{accommodations.filter((a) => !a.availability).length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Accommodations</CardTitle>
          <CardDescription>Manage your accommodation listings</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accommodations.map((accommodation) => (
                <TableRow key={accommodation.id}>
                  <TableCell className="font-medium">{accommodation.name}</TableCell>
                  <TableCell>{accommodation.address}</TableCell>
                  <TableCell>
                    {accommodation.availability ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Available
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                        Occupied
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{new Date(accommodation.createdAt).toLocaleDateString()}</TableCell>
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
