// src/hooks/useRecentActivity.ts
import { useEffect, useState } from "react";
import axios from "@/utils/axios";

type ActivityItem = {
  id: number;
  name?: string;
  title?: string;
  createdAt: string;
};

type ActivityData = {
  accommodations: ActivityItem[];
  events: ActivityItem[];
  emergencyServices: ActivityItem[];
  users: ActivityItem[];
};

export function useRecentActivity() {
  const [data, setData] = useState<ActivityData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await axios.get("/dashboard/recent-activities");
        setData(res.data);
      } catch (err) {
        console.error("Erro ao buscar atividades recentes", err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  return { data, loading };
}
