'use client'
import { useGetPostQuery } from '@/lib/slice'
import { useParams } from 'next/navigation'

export default function Comments() {
  const params = useParams()
  const postId = params.id as string
  const { data, isLoading } = useGetPostQuery(postId)
  if (isLoading) {
    return 'Carregando'
  }
  return <h2>{data?.content}</h2>
}
