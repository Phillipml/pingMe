'use client'
import { useRouter } from 'next/navigation'
export function useNavigation() {
  const router = useRouter()
  return {
    toComment: (postId: number | string) => {
      router.push(`/comments/${postId}`)
    },
    toUserProfile: (userId: number | string) => {
      router.push(`/user-profile/${userId}`)
    },
    toSearch: (query: string) => {
      router.push(`/search?q=${encodeURIComponent(query)}`)
    }
  }
}
