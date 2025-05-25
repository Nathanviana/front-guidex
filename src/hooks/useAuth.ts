// src/hooks/useAuth.ts
import { useEffect, useState } from "react"
import axios from "@/utils/axios"

export function useAuth() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("/auth/me")
        setUser(response.data)
      } catch (err) {
        console.error("Erro ao carregar dados do usuário", err)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  return { user, loading }
}
