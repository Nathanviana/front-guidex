import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Edit, GraduationCap, Plus, Trash, User, UserCog, Users } from "lucide-react"

// Mock data for users
const users = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    role: "admin",
    createdAt: "2023-01-15T10:00:00Z",
    updatedAt: "2023-05-20T14:30:00Z",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "user",
    createdAt: "2023-02-10T09:15:00Z",
    updatedAt: "2023-02-10T09:15:00Z",
  },
  {
    id: 3,
    name: "Michael Johnson",
    email: "michael.j@university.edu",
    role: "student",
    country: "USA",
    university: "State University",
    course: "Computer Science",
    language: "English",
    createdAt: "2023-03-05T11:30:00Z",
    updatedAt: "2023-04-12T16:45:00Z",
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily.davis@example.com",
    role: "user",
    createdAt: "2023-03-20T13:45:00Z",
    updatedAt: "2023-03-20T13:45:00Z",
  },
  {
    id: 5,
    name: "Carlos Rodriguez",
    email: "carlos.r@university.edu",
    role: "student",
    country: "Spain",
    university: "Madrid University",
    course: "Business Administration",
    language: "Spanish",
    createdAt: "2023-04-02T08:20:00Z",
    updatedAt: "2023-04-15T10:10:00Z",
  },
  {
    id: 6,
    name: "Sarah Wilson",
    email: "sarah.w@example.com",
    role: "user",
    createdAt: "2023-04-18T15:30:00Z",
    updatedAt: "2023-04-18T15:30:00Z",
  },
  {
    id: 7,
    name: "David Brown",
    email: "david.b@university.edu",
    role: "student",
    country: "UK",
    university: "London University",
    course: "Engineering",
    language: "English",
    createdAt: "2023-05-05T09:45:00Z",
    updatedAt: "2023-05-10T14:20:00Z",
  },
  {
    id: 8,
    name: "Lisa Chen",
    email: "lisa.chen@example.com",
    role: "admin",
    createdAt: "2023-05-12T11:15:00Z",
    updatedAt: "2023-05-12T11:15:00Z",
  },
]

// Helper function to get initials from name
function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}

// Helper function to format date
function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export default function UsersPage() {
  // Count users by role
  const adminCount = users.filter((user) => user.role === "admin").length
  const studentCount = users.filter((user) => user.role === "student").length
  const regularUserCount = users.filter((user) => user.role === "user").length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Users</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add User
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Administrators</CardTitle>
            <UserCog className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Students</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Regular Users</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{regularUserCount}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>Manage user accounts and permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={user.name} />
                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {user.role === "admin" && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        Admin
                      </Badge>
                    )}
                    {user.role === "student" && (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Student
                      </Badge>
                    )}
                    {user.role === "user" && (
                      <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                        User
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{formatDate(user.createdAt)}</TableCell>
                  <TableCell>{formatDate(user.updatedAt)}</TableCell>
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

      <Card>
        <CardHeader>
          <CardTitle>Student Details</CardTitle>
          <CardDescription>Additional information for student users</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>University</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Language</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users
                .filter((user) => user.role === "student")
                .map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={student.name} />
                          <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-xs text-muted-foreground">{student.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{student.country}</TableCell>
                    <TableCell>{student.university}</TableCell>
                    <TableCell>{student.course}</TableCell>
                    <TableCell>{student.language}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
