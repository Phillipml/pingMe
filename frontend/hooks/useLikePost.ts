import { useLikePostMutation } from '@/lib/slice'

export const useLikePost = () => {
  const [likePostMutation, { isLoading }] = useLikePostMutation()

  const likePost = async (id: number) => {
    try {
      await likePostMutation(id).unwrap()
    } catch (error) {
      const err = error as { data?: { error?: string; message?: string } }
      throw new Error(
        err?.data?.error || err?.data?.message || 'Erro ao curtir post'
      )
    }
  }

  return { likePost, isLoading }
}
