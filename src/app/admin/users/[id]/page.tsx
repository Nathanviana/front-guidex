import UserDetailClient from './UserDetailClient'

export default function Page({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  return <UserDetailClient id={params.id} />
}