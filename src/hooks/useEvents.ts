// File: front-guidex/src/hooks/useEvents.ts
import { useEffect, useState } from "react";
import axios from "@/utils/axios";

export type Event = {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  createdAt: string;
  updatedAt: string;
};

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchEvents = async () => {
    try {
      const response = await axios.get("/events");
      setEvents(response.data);
    } catch (err: any) {
      console.error(err);
      setError("Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return { events, loading, error, refetch: fetchEvents };
}