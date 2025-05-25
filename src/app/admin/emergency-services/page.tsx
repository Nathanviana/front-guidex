"use client";

import { useEmergencyServices } from "@/hooks/useEmergencyServices";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, LifeBuoy, Plus, Trash } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

export default function EmergencyServicesPage() {
  const { emergencyServices, loading, error } = useEmergencyServices();

  if (loading) {
    return <Skeleton className="h-10 w-full rounded-md mb-4" />;
  }
  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  const totalServices = emergencyServices.length;

  // Count services by type
  const serviceTypes = emergencyServices.reduce((acc, service) => {
    acc[service.type] = (acc[service.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Emergency Services</h1>
        <Button asChild>
          <Link href="/admin/emergency-services/add">
            <Plus className="mr-2 h-4 w-4" /> Add Service
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Services
            </CardTitle>
            <LifeBuoy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalServices}</div>
          </CardContent>
        </Card>
        {Object.entries(serviceTypes)
          .slice(0, 3)
          .map(([type, count]) => (
            <Card key={type}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium capitalize">
                  {type}
                </CardTitle>
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
                  <TableCell className="font-medium">
                    {service.serviceName}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {service.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{service.phoneNumber}</TableCell>
                  <TableCell>{service.address}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/emergency-services/${service.id}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
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
  );
}
