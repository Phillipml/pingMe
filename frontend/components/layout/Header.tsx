'use client'
import {
  useGetProfileQuery,
  useLogoutMutation,
  useSearchUsersQuery
} from '@/lib/slice'
import Container from './Container'
import { Logo } from '../ui/Logo'
import { getMediaUrl } from '@/utils/api-utils'
import Input from '../ui/Input'
import { CiLogout, CiSearch } from 'react-icons/ci'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'

export default function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const { data, isLoading } = useGetProfileQuery()
  const [logout] = useLogoutMutation()
  const [searchUser, setSearchUser] = useState('')
  const handleLogout = async () => {
    try {
      const response = await logout({}).unwrap()
      alert(response.message)
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken')
      }
      router.push('/login')
    } catch (error) {
      const err = error as { data?: { error?: string; message?: string } }
      alert(err?.data?.error || err?.data?.message || 'Erro ao fazer logout')
    }
  }
  const HIDDEN_HEADER_ROUTES = ['/login', '/register', '/user-created'] as const
  const hideHeader = HIDDEN_HEADER_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  )
  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const query = searchUser.trim()
    if (query.length <= 2) {
      alert('Digite ao menos 3 caracteres para pesquisar')
      router.push('/feed')
      return
    }

    if (query) {
      router.push(`/search?q=${encodeURIComponent(query)}`)
      setSearchUser('')
    }
  }
  return hideHeader ? null : (
    <header className="w-full bg-violet-600">
      <Container className="flex items-center justify-around p-2">
        <div className="flex items-center justify-center flex-1">
          <button
            className="rounded-full mr-2 border p-0.5 cursor-pointer"
            onClick={handleLogout}
          >
            <CiLogout className="text-3xl text-white" />
          </button>
          <Link href={'/profile'}>
            <div>
              <img
                src={getMediaUrl(`${data?.info.avatar}`)}
                className="rounded-full w-12 h-12 object-cover m-auto"
              />
              <h2 className="pl-2 pr-2">
                {isLoading ? '' : `${data?.username}`}
              </h2>
            </div>
          </Link>
        </div>
        <div className="flex items-center justify-center flex-1">
          <Link href={'/'}>
            <Logo />
          </Link>
        </div>
        <div className="flex items-center justify-center flex-1">
          <form
            onSubmit={handleSearch}
            className="flex bg-gray-950 rounded-full p-0 w-64 mb-0 overflow-hidden"
          >
            <button
              type="submit"
              className="flex items-center justify-center bg-gray-900 px-4 py-2"
            >
              <CiSearch className="text-gray-400" />
            </button>
            <Input
              placeholder="Buscar usuários"
              className="border-none focus:outline-none bg-transparent flex-1"
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
            />
          </form>
        </div>
      </Container>
    </header>
  )
}
