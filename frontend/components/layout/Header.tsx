'use client'
import { useGetProfileQuery, useLogoutMutation } from '@/lib/slice'
import Container from './Container'
import { Logo } from '../ui/Logo'
import { getMediaUrl } from '@/utils/api-utils'
import { CiLogout, CiSearch } from 'react-icons/ci'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { FormEvent, useState, useEffect } from 'react'
import { Routes } from '@/utils/routes'
import defaulUserAvatar from '@/public/user.png'

export default function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const [searchUser, setSearchUser] = useState('')
  const [hasToken, setHasToken] = useState(false)
  const { hideHeader } = Routes()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkToken = () => {
        const token = localStorage.getItem('accessToken')
        setHasToken(!!token)
      }

      checkToken()

      const handleStorageChange = () => {
        checkToken()
      }

      window.addEventListener('storage', handleStorageChange)
      return () => window.removeEventListener('storage', handleStorageChange)
    }
  }, [pathname])

  const { data, isLoading } = useGetProfileQuery(undefined, {
    skip: !hasToken
  })
  const [logout] = useLogoutMutation()
  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken') ?? undefined
      const response = await logout({ refresh: refreshToken }).unwrap()
      alert(response.message)
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        setHasToken(false)
      }
      router.push('/login')
    } catch (error) {
      const err = error as { data?: { error?: string; message?: string } }
      alert(err?.data?.error || err?.data?.message || 'Erro ao fazer logout')
    }
  }

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
          >
            <CiLogout className="text-3xl text-white" />
          </button>
          <Link href={'/profile'}>
            <div>
              <img
                src={
                  data && typeof data.info.avatar === 'string'
                    ? getMediaUrl(`${data.info.avatar}`)
                    : typeof defaulUserAvatar === 'string'
                      ? defaulUserAvatar
                      : (defaulUserAvatar as any).src
                }
                className="rounded-full w-12 h-12 object-cover m-auto"
              />
              <h2 className="pl-2 pr-2 truncate">
                {isLoading ? 'Carregando...' : `${data?.username}`}
              </h2>
            </div>
          </Link>
        </div>
        <div className="flex items-center justify-center lg:justify-end flex-1 order-3 lg:order-3">
          <form
            onSubmit={handleSearch}
            className="flex items-center bg-gray-950 rounded-full p-0 w-64 mb-0 overflow-hidden h-10"
          >
            <button
              type="submit"
              className="flex items-center justify-center bg-gray-900 px-4 h-full rounded-l-full"
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
