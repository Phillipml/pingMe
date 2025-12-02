'use client'
import { useGetProfileQuery, useLogoutMutation } from '@/lib/slice'
import Container from './Container'
import { Logo } from '../ui/Logo'
import { getMediaUrl } from '@/utils/api-utils'
import Input from '../ui/Input'
import { CiLogout, CiSearch } from 'react-icons/ci'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

export default function Header() {
  const router = useRouter()
  const { data, isLoading } = useGetProfileQuery()
  const [logout, error] = useLogoutMutation()
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
  const pathname = usePathname()
  const hideHeader = HIDDEN_HEADER_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  )
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
          <div className="flex bg-gray-950 rounded-full p-0 w-64 mb-0 overflow-hidden">
            <div className="flex items-center justify-center bg-gray-900 px-4 py-2">
              <CiSearch className="text-gray-400" />
            </div>
            <Input
              placeholder="Search"
              className="border-none focus:outline-none bg-transparent flex-1"
            />
          </div>
        </div>
      </Container>
    </header>
  )
}
