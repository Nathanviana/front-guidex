import { useEffect, useState } from "react"
import axios from "@/utils/axios"

export type User = {
  id: number
  name: string
  email: string
  password: string
  role: string
  userType: "normal" | "student"
  isActive: boolean
  country?: string
  university?: string
  course?: string
  language?: string
  createdAt: string
  updatedAt: string
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/users")
      setUsers(response.data)
    } catch (err: any) {
      setError("Failed to fetch users")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return { users, loading, error, refetch: fetchUsers }
}
