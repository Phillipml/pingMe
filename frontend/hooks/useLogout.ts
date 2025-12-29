'use client'
import { useLogoutMutation } from '@/lib/slice'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export function useLogout() {
  const router = useRouter()
  const pathname = useLogoutMutation()
  const [hasToken, setHasToken] = useState(false)
  const [logout] = useLogoutMutation()

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
  return {
    hasToken,
    handleLogout
  }
}
