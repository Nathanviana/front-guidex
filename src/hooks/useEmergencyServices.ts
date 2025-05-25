// File: front-guidex/src/hooks/useEmergencyServices.ts
import { useEffect, useState } from "react";
import axios from "@/utils/axios";

export type EmergencyService = {
  id: number;
  serviceName: string;
  phoneNumber: string;
  address: string;
  type: string;
  createdAt: string;
  updatedAt: string;
};

export function useEmergencyServices() {
  const [emergencyServices, setEmergencyServices] = useState<EmergencyService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchEmergencyServices = async () => {
    try {
      const response = await axios.get("/emergency-services");
      setEmergencyServices(response.data);
    } catch (err: any) {
      console.error(err);
      setError("Failed to fetch emergency services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmergencyServices();
  }, []);

  return { emergencyServices, loading, error, refetch: fetchEmergencyServices };
}