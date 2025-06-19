import EditAccommodationClient from './EditAccommodationClient'

export default function Page({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  return <EditAccommodationClient id={params.id} />
}