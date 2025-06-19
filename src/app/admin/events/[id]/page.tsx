import EditEventClient from "./EditEventClient"

export default function Page({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  return <EditEventClient id={params.id} />
}