'use client'
import { User } from '@/utils/api-interfaces'
import { API_BASE_URL } from '@/utils/api-utils'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Home() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function checkProfile() {
      try {
        const accessToken =
          typeof window !== 'undefined'
            ? localStorage.getItem('accessToken')
            : null

        if (!accessToken) {
          router.push('/login')
          return
        }

        const response = await fetch(`${API_BASE_URL}/auth/profile/`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
          },
          cache: 'no-store'
        })

        if (!response.ok) {
          if (response.status === 401 && typeof window !== 'undefined') {
            localStorage.removeItem('accessToken')
          }
          router.push('/login')
          return
        }

        const data: User = await response.json()
        handleRedirect(data)
      } catch (error) {
        console.error('Error checking profile:', error)
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken')
        }
        router.push('/login')
      } finally {
        setIsLoading(false)
      }
    }

    function handleRedirect(data: User) {
      const status = data?.info?.status
      if (status === 0) {
        router.push('/complete-profile')
      } else {
        router.push('/feed')
      }
    }

    checkProfile()
  }, [router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p>Carregando...</p>
        </div>
      </div>
    )
  }

  return null
}
