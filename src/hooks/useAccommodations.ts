// File: front-guidex/src/hooks/useAccommodations.ts
import { useEffect, useState } from "react"
import axios from "@/utils/axios"

export type Accommodation = {
  id: number
  name: string
  address: string
  description: string
  availability: boolean
  createdAt: string
  updatedAt: string
}

export function useAccommodations() {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchAccommodations = async () => {
    try {
      const response = await axios.get("/accommodations")
      setAccommodations(response.data)
    } catch (err: any) {
      console.error(err)
      setError("Failed to fetch accommodations")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAccommodations()
  }, [])

  return { accommodations, loading, error, refetch: fetchAccommodations }
}