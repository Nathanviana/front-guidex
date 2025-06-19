// **sem** "use client"
import EditEmergencyServiceClient from "./EditEmergencyServiceClient"

export default function Page({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  return <EditEmergencyServiceClient id={params.id} />
}