'use client'
import { useGetProfileQuery } from '@/lib/slice'
import Container from './Container'
import { Logo } from '../ui/Logo'
import { getMediaUrl } from '@/utils/api-utils'
import Input from '../ui/Input'
import { CiSearch } from 'react-icons/ci'
import Link from 'next/link'

export default function Header() {
  const { data, isLoading } = useGetProfileQuery()
  return (
    <header className="w-full bg-violet-600">
      <Container className="flex items-center justify-around p-2">
        <Link href={'/'} className="flex items-center justify-center flex-1">
          <img
            src={getMediaUrl(`${data?.info.avatar}`)}
            className="rounded-full w-12 h-12 object-cover"
          />
          <h2 className="pl-2 pr-2">{isLoading ? '' : `${data?.username}`}</h2>
        </Link>
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
