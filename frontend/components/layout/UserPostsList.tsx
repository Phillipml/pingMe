'use client'
import { useDeletePostMutation, useGetUserPostQuery } from '@/lib/slice'
import { skipToken } from '@reduxjs/toolkit/query'
import { useEffect, useState } from 'react'
import { AiOutlineLoading } from 'react-icons/ai'
import Button from '../ui/Button'
import UserPostCard from './Card/UserPostCard'

interface UserPostsListProps {
  userId: number | string | null | undefined
  title?: string
  pageSize?: number
  showDelete?: boolean
  onPostDelete: () => void
  className?: string
}
export default function UserPostsList({
  userId,
  title = 'Pings',
  pageSize = 5,
  showDelete = false,
  onPostDelete,
  className = ''
}: UserPostsListProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [isDeletingById, setIsDeletingById] = useState<number | null>(null)
  const { data: userPosts, isLoading: isLoadingPosts } = useGetUserPostQuery(
    userId ? { id: userId, page: currentPage } : skipToken
  )
  const [deletePost] = useDeletePostMutation()
  useEffect(() => {
    setCurrentPage(1)
  }, [userId])
  const totalPages = userPosts?.count
    ? Math.ceil(userPosts.count / pageSize)
    : 0
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      if (currentPage < totalPages) setCurrentPage((prev) => prev + 1)
    }
  }
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1)
    }
  }
  const deletePostById = async (id: number) => {
    if (!id) {
      alert('ID do post inválido')
      return
    }
    setIsDeletingById(id)
    try {
      await deletePost(id).unwrap()
      alert('Post deletado com sucesso')
      onPostDelete()
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || error?.data?.error || 'Erro ao deletar post'
      alert(errorMessage)
    } finally {
      setIsDeletingById(null)
    }
  }
  if (isLoadingPosts) {
    return (
      <div className={className}>
        <h2 className="text-center text-xl sm:text-2xl font-bold mb-4">
          {title}
        </h2>
        <AiOutlineLoading className="animate-spin m-auto text-4xl" />
      </div>
    )
  }

  return (
    <div className={className}>
      <h2 className="text-center text-xl sm:text-2xl font-bold mb-4">
        {title}
      </h2>
      {userPosts?.results && userPosts.results.length > 0 ? (
        <>
          <ul className="m-auto justify-between">
            {userPosts.results.map((post) => (
              <UserPostCard
                key={post.id || ''}
                created_at={post.created_at}
                onClick={() => null}
                clickDelete={
                  showDelete ? () => deletePostById(post.id) : () => {}
                }
                commentRoute={post.id}
                is_liked={post.is_liked}
                isDeleting={isDeletingById === post.id}
                comments_count={post.comments_count}
                likes_count={post.likes_count}
                showActions={showDelete}
              >
                {post.content}
              </UserPostCard>
            ))}
          </ul>
          <div className="flex flex-col items-center gap-4 mt-8 mb-8">
            <p className="text-xs sm:text-sm text-gray-400 text-center px-4">
              Página {currentPage} de {totalPages || 1}
              {userPosts?.count && ` • Total: ${userPosts.count} posts`}
            </p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-center w-full sm:w-auto">
              <Button
                onClick={handlePreviousPage}
                disabled={currentPage <= 1 || isLoadingPosts}
                className="w-full sm:w-auto px-4 sm:px-6 text-sm sm:text-base"
              >
                ← Anterior
              </Button>
              <Button
                onClick={handleNextPage}
                disabled={
                  currentPage >= totalPages ||
                  isLoadingPosts ||
                  totalPages === 0
                }
                className="w-full sm:w-auto px-4 sm:px-6 text-sm sm:text-base"
              >
                Próxima →
              </Button>
            </div>
          </div>
        </>
      ) : (
        <p className="text-center text-gray-400 mt-4 text-sm sm:text-base">
          Nenhum post encontrado
        </p>
      )}
    </div>
  )
}
