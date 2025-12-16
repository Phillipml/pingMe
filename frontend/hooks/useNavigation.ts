'use client'
import { useRouter } from 'next/navigation'
export function useNavigation() {
  const router = useRouter()
  return {
    toComment: (postId: number | string) => {
      if (postId === undefined) {
        return alert('erro ao carregar comentários')
      }
      return router.push(`/comments/${postId}`)
    }
  }
}
