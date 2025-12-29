'use client'
import { usePathname } from 'next/navigation'
export function Routes() {
  const pathname = usePathname()

  const HIDDEN_HEADER_ROUTES = [
    '/login',
    '/register',
    '/user-created',
    '/complete-profile'
  ] as const

  const hideHeader = HIDDEN_HEADER_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  )

  return {
    hideHeader
  }
}
