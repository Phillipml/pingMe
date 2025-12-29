'use client'
import { useGetProfileQuery } from '@/lib/slice'
import Container from './Container'
import { Logo } from '../ui/Logo'
import { UserProfileLink } from '../ui/UserProfileLink'
import { CiLogout, CiSearch } from 'react-icons/ci'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormEvent, useState, useEffect } from 'react'
import { Routes } from '@/utils/routes'
import { useLogout } from '@/hooks/useLogout'

export default function Header() {
  const router = useRouter()

  const [searchUser, setSearchUser] = useState('')

  const { hideHeader } = Routes()
  const { handleLogout } = useLogout()

  const [hasToken, setHasToken] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    if (typeof window !== 'undefined') {
      const checkToken = () => {
        const token = localStorage.getItem('accessToken')
        setHasToken(!!token)
      }

      checkToken()
      const interval = setInterval(checkToken, 1000)
      return () => clearInterval(interval)
    }
  }, [])

  const { data, isLoading, refetch } = useGetProfileQuery(undefined, {
    skip: !hasToken || !isMounted
  })

  useEffect(() => {
    if (hasToken && isMounted) {
      refetch()
    }
  }, [hasToken, isMounted, refetch])

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const query = searchUser.trim()
    if (query.length <= 1) {
      alert('Digite ao menos 2 caracteres para pesquisar')
      setSearchUser('')
      return
    }

    if (query) {
      router.push(`/search?q=${encodeURIComponent(query)}`)
      setSearchUser('')
    }
  }
  return hideHeader ? null : (
    <header className="w-full bg-violet-600">
      <Container className="grid lg:grid-cols-3 items-center p-2 gap-4 relative">
        <div className="flex items-center justify-center lg:justify-start order-1 lg:order-2 gap-2">
          <button
            className="rounded-full border p-0.5 cursor-pointer lg:hidden"
            onClick={handleLogout}
            aria-label="Fazer logout"
          >
            <CiLogout className="text-3xl text-white" />
          </button>
          <Link
            href={'/'}
            className="lg:absolute lg:left-1/2 lg:-translate-x-1/2"
          >
            <Logo />
          </Link>
        </div>
        <div className="flex items-center justify-center flex-2 order-2 lg:order-1">
          <button
            className="rounded-full mr-2 border p-0.5 cursor-pointer hidden lg:flex"
            onClick={handleLogout}
            aria-label="Fazer logout"
          >
            <CiLogout className="text-3xl text-white" />
          </button>
          {data && (
            <UserProfileLink
              user={data}
              usernameClassName="pl-2 pr-2 truncate"
            />
          )}
          {isLoading && !data && (
            <div>
              <div className="rounded-full w-12 h-12 object-cover m-auto bg-gray-300 animate-pulse" />
              <h2 className="pl-2 pr-2 truncate">Carregando...</h2>
            </div>
          )}
        </div>
        <div className="flex items-center justify-center lg:justify-end flex-1 order-3 lg:order-3">
          <form
            onSubmit={handleSearch}
            className="flex items-center bg-gray-950 rounded-full p-0 w-64 mb-0 overflow-hidden h-10"
          >
            <button
              type="submit"
              className="flex items-center justify-center bg-gray-900 px-4 h-full rounded-l-full"
              aria-label="Buscar usuários"
            >
              <CiSearch className="text-gray-400" />
            </button>
            <input
              type="text"
              placeholder="Buscar usuários"
              className="border-none focus:outline-none bg-transparent flex-1 px-3 h-full"
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
            />
          </form>
        </div>
      </Container>
    </header>
  )
}
