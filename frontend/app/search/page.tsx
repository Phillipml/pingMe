'use client'
import Container from '@/components/layout/Container'
import { useSearchUsersQuery } from '@/lib/slice'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export default function Search() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get('q') || ''

  const { data, isLoading, error } = useSearchUsersQuery(query, {
    skip: !query || query.length < 2
  })
  useEffect(() => {
    if (!query || query.length < 2) {
      router.push('/feed')
    }
  }, [query, router])

  if (!query || query.length < 2) {
    return null
  }
  return (
    <Container>
      <h2 className="text-center text-xl">Resultado da busca por: {query}</h2>
      <ul>

      {data?.results.map((users) => (
          <li>{users.username}</li>
        ))}
        </ul>
    </Container>
  )
}
