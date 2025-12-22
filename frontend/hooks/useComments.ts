'use client'
import {
  apiSlice,
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useUpdateCommentMutation
} from '@/lib/slice'
import { AppDispatch } from '@/lib/store'
import { CreateComment } from '@/utils/api-interfaces'
import { useState } from 'react'
import { useDispatch } from 'react-redux'

export function useComments(postId: number | string) {
  const dispatch = useDispatch<AppDispatch>()
  const [deleteComment, { isLoading: isDeleting }] = useDeleteCommentMutation()
  const [createComment, { isLoading: isCreating }] = useCreateCommentMutation()
  const [updateComment, { isLoading: isUpdating }] = useUpdateCommentMutation()
  const [deleteCommentId, setDeleteCommentId] = useState<
    number | string | null
  >(null)
  const handleDeleteComment = async (commentId: number) => {
    if (!commentId) {
      alert('ID do comentário inválido')
      return
    }
    const confirmed = window.confirm(
      'Tem certeza que deseja deletar esse comentario?'
    )
    if (!confirmed) return
    setDeleteCommentId(commentId)
    try {
      await deleteComment(commentId).unwrap()
      dispatch(
        apiSlice.util.updateQueryData('getComments', postId, (draft) => {
          draft.results = draft.results.filter(
            (comment) => comment.id !== commentId
          )
          draft.count = draft.count - 1
        })
      )
      dispatch(
        apiSlice.util.updateQueryData('getPost', postId, (draft) => {
          if (draft) {
            draft.comments_count = Math.max(0, draft.comments_count - 1)
          }
        })
      )
      dispatch(
        apiSlice.util.updateQueryData('feed', undefined, (draft) => {
          const postToUpdate = draft.results.find(
            (p) => p.id === Number(postId)
          )
          if (postToUpdate) {
            postToUpdate.comments_count = Math.max(
              0,
              postToUpdate.comments_count - 1
            )
          }
        })
      )
    } catch (error: unknown) {
      const err = error as { data?: { error?: string; message?: string } }
      const errorMessage =
        err?.data?.message || err?.data?.error || 'Erro ao deletar comentário'
      alert(errorMessage)
    } finally {
      setDeleteCommentId(null)
    }
  }

  const handleCreateComment = async (data: CreateComment) => {
    try {
      const response = await createComment({ postId, data }).unwrap()
      dispatch(
        apiSlice.util.updateQueryData('getComments', postId, (draft) => {
          draft.results.unshift(response.comment)
          draft.count = draft.count + 1
        })
      )
      dispatch(
        apiSlice.util.updateQueryData('getPost', postId, (draft) => {
          if (draft) {
            draft.comments_count = draft.comments_count + 1
          }
        })
      )
      dispatch(
        apiSlice.util.updateQueryData('feed', undefined, (draft) => {
          const postToUpdate = draft.results.find(
            (p) => p.id === Number(postId)
          )
          if (postToUpdate) {
            postToUpdate.comments_count = postToUpdate.comments_count + 1
          }
        })
      )
      return response
    } catch (error) {
      const err = error as { data?: { error?: string; message?: string } }
      const errorMessage =
        err?.data?.message || err?.data?.error || 'Erro ao criar comentário'
      alert(errorMessage)
      throw error
    }
  }
  const handleUpdateComment = async (
    commentId: number,
    data: CreateComment
  ) => {
    try {
      const response = await updateComment({ commentId, data }).unwrap()
      dispatch(
        apiSlice.util.updateQueryData('getComments', postId, (draft) => {
          const commentIndex = draft.results.findIndex(
            (c) => c.id === commentId
          )
          if (commentIndex !== -1) {
            draft.results[commentIndex] = response.comment
          }
        })
      )
      return response
    } catch (error: unknown) {
      const err = error as { data?: { error?: string; message?: string } }
      const errorMessage =
        err?.data?.message || err?.data?.error || 'Erro ao atualizar comentário'
      alert(errorMessage)
      throw error
    }
  }
  return {
    deleteComment: handleDeleteComment,
    createComment: handleCreateComment,
    updateComment: handleUpdateComment,
    isDeleting,
    isCreating,
    isUpdating,
    deleteCommentId
  }
}
