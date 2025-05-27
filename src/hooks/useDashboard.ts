// File: src/hooks/useDashboard.ts
import { useEffect, useState } from "react"
import axios from "@/utils/axios"

export type DashboardData = {
  totalUsers: number;
  totalAccommodations: number;
  availableAccommodations: number;
  occupiedAccommodations: number;
  totalEvents: number;
  totalEmergencyServices: number;
};

export function useDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/dashboard/summary")
        setData(res.data)
        console.log("Dados do dashboard:", res.data)
      } catch (err) {
        console.error("Erro ao buscar dados do dashboard", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, loading }
}