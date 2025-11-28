'use client'
import { useGetProfileQuery } from '@/lib/slice'
import Container from './Container'
import { Logo } from '../ui/Logo'

export default function Header() {
  const { data, isLoading } = useGetProfileQuery()
  return (
    <header>
      <Container className="flex justify-around bg-violet-600">
        <Logo />
        <div className="flex">
          <img src={`${data?.info.avatar}`} className="pl-2 pr-2" />
          <h2 className="pl-2 pr-2">{isLoading ? '' : `${data?.username}`}</h2>
        </div>
        <h2>Search</h2>
      </Container>
    </header>
  )
}
