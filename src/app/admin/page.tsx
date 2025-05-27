"use client";

import { Building2, Calendar, LifeBuoy, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth"; 
import { useDashboard } from "@/hooks/useDashboard";
import { useRecentActivity } from "@/hooks/useRecentActivity";

export default function AdminDashboard() {
  const router = useRouter();
  const { user, loading: loadingUser } = useAuth();
  const { data: summary, loading: loadingSummary } = useDashboard();
  const { data: recent, loading: loadingRecent } = useRecentActivity();

  useEffect(() => {
    if (!loadingUser && (user as { name: string; email: string; role?: string })?.role !== "admin") {
      router.push("/login");
    }
  }, [loadingUser, user, router]);

  if (loadingSummary || loadingRecent) return <p>Carregando...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="text-muted-foreground">Welcome to your admin dashboard.</p>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.totalUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Accommodations</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.totalAccommodations}</div>
            <p className="text-xs text-muted-foreground">
              {`${summary?.availableAccommodations} available, ${summary?.occupiedAccommodations} occupied`}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.totalEvents}</div>
            <p className="text-xs text-muted-foreground">3 this week, 5 next week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emergency Services</CardTitle>
            <LifeBuoy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.totalEmergencyServices}</div>
            <p className="text-xs text-muted-foreground">5 hospitals, 4 police stations, 6 others</p>
          </CardContent>
        </Card>
      </div>

      <h2 className="mt-8 text-xl font-semibold">Recent Activity</h2>
      <div className="rounded-md border">
        <div className="p-4 space-y-4">
          {recent?.users.map((user) => (
            <div key={`user-${user.id}`} className="flex items-center gap-4">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">New user: {user.name}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(user.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
          {recent?.accommodations.map((acc) => (
            <div key={`acc-${acc.id}`} className="flex items-center gap-4">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Building2 className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Accommodation: {acc.name}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(acc.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
          {recent?.events.map((event) => (
            <div key={`event-${event.id}`} className="flex items-center gap-4">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Calendar className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Event: {event.title}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(event.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
          {recent?.emergencyServices.map((service) => (
            <div key={`es-${service.id}`} className="flex items-center gap-4">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <LifeBuoy className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Emergency: {service.name}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(service.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
