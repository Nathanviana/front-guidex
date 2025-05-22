import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Calendar, Edit, Plus, Trash } from "lucide-react"

// Mock data for events
const events = [
  {
    id: 1,
    name: "Welcome Party",
    description: "Welcome party for new students",
    startDate: "2023-10-15T18:00:00Z",
    endDate: "2023-10-15T22:00:00Z",
    location: "University Hall",
  },
  {
    id: 2,
    name: "Career Fair",
    description: "Annual career fair with top companies",
    startDate: "2023-11-05T10:00:00Z",
    endDate: "2023-11-05T16:00:00Z",
    location: "Convention Center",
  },
  {
    id: 3,
    name: "Cultural Festival",
    description: "Celebration of diverse cultures",
    startDate: "2023-12-10T12:00:00Z",
    endDate: "2023-12-12T20:00:00Z",
    location: "City Park",
  },
  {
    id: 4,
    name: "Tech Conference",
    description: "Latest trends in technology",
    startDate: "2024-01-20T09:00:00Z",
    endDate: "2024-01-21T17:00:00Z",
    location: "Tech Hub",
  },
  {
    id: 5,
    name: "Alumni Reunion",
    description: "Annual gathering of university alumni",
    startDate: "2024-02-15T19:00:00Z",
    endDate: "2024-02-15T23:00:00Z",
    location: "Grand Hotel",
  },
]

// Helper function to determine if an event is upcoming, ongoing, or past
function getEventStatus(startDate: string, endDate: string) {
  const now = new Date()
  const start = new Date(startDate)
  const end = new Date(endDate)

  if (now < start) return "upcoming"
  if (now > end) return "past"
  return "ongoing"
}

export default function EventsPage() {
  const upcomingEvents = events.filter((e) => getEventStatus(e.startDate, e.endDate) === "upcoming")
  const ongoingEvents = events.filter((e) => getEventStatus(e.startDate, e.endDate) === "ongoing")
  const pastEvents = events.filter((e) => getEventStatus(e.startDate, e.endDate) === "past")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Events</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Event
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingEvents.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ongoing Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ongoingEvents.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Past Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pastEvents.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Events</CardTitle>
          <CardDescription>Manage your events calendar</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event) => {
                const status = getEventStatus(event.startDate, event.endDate)
                return (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">{event.name}</TableCell>
                    <TableCell>{event.location}</TableCell>
                    <TableCell>{new Date(event.startDate).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(event.endDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {status === "upcoming" && (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          Upcoming
                        </Badge>
                      )}
                      {status === "ongoing" && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Ongoing
                        </Badge>
                      )}
                      {status === "past" && (
                        <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                          Past
                        </Badge>
                      )}
                    </TableCell>
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
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
