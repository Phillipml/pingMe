'use client'
import Container from '@/components/layout/Container'
import { useSearchUsersQuery } from '@/lib/slice'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { FaRegUserCircle } from 'react-icons/fa'

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
      <h2 className="text-center text-xl mb-8">
        Resultado da busca por: {query}
      </h2>
      {data?.results && data.results.length > 0 ? (
        <ul>
          {data?.results.map((users) => (
            <li
              className="flex m-auto p-2 mb-8 w-1/2 shadow-2xl rounded-2xl hover:shadow-violet-600 transition-shadow cursor-pointer"
              key={users.id}
            >
              <Link
                href={`/user-profile/${users.id}`}
                className="flex w-full justify-start items-center gap-8"
              >
                {users.avatar ? (
                  <img
                    src={users.avatar}
                    alt={`${users.username} profile avatar`}
                    className="rounded-full w-14 h-14 object-cover"
                  />
                ) : (
                  <FaRegUserCircle className="rounded-full w-14 h-14 object-cover" />
                )}

                {users.username}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <h2 className="text-center">Nenhum usuário encontrado</h2>
      )}
    </Container>
  )
}
