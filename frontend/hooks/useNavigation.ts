'use client'
import { useRouter } from 'next/navigation'
export function useNavigation() {
  const router = useRouter()
  return {
    toComment: (postId: number | string) => {
      router.push(`/comments/${postId}`)
    }
  }
}
