'use client'
import Container from '@/components/layout/Container'
import Form from '@/components/layout/Form'
import Button from '@/components/ui/Button'
import { useComments } from '@/hooks/useComments'
import {
  useGetCommentsQuery,
  useGetPostQuery,
  useGetProfileQuery
} from '@/lib/slice'
import { useParams } from 'next/navigation'
import { FormEvent, useState } from 'react'
import Image from 'next/image'
import { isExternalUrl } from '@/utils/api-utils'
import { AiOutlineLoading } from 'react-icons/ai'
import { MdDeleteForever, MdEditSquare } from 'react-icons/md'

export default function Comments() {
  const params = useParams()
  const postId = params.id as string
  const { data: postData, isLoading } = useGetPostQuery(postId)
  const { data: commentsData, isLoading: loadingComments } =
    useGetCommentsQuery(postId)
  const { data: profileData } = useGetProfileQuery()
  const {
    deleteComment,
    createComment,
    updateComment,
    isDeleting,
    isCreating,
    isUpdating
  } = useComments(postId)
  const [comment, setComment] = useState('')
  const [isCommentCreated, setIsCommentCreated] = useState(false)
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null)
  const [editingContent, setEditingContent] = useState('')
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!comment.trim()) {
      alert('Favor escreva algo para comentar')
      return
    }
    try {
      await createComment({ content: comment.trim() })
      setComment('')
      setIsCommentCreated(true)
      setTimeout(() => {
        setIsCommentCreated(false)
      }, 8000)
    } catch (error) {
      console.error('Erro ao criar comentário:', error)
    }
  }
  const creatingCommentaryResponse = () => {
    if (isCreating) {
      return (
        <span className="text-green-600 text-sm sm:text-base">
          Comentando...
        </span>
      )
    }
    if (isCommentCreated) {
      return (
        <span className="text-green-600 text-sm sm:text-base">
          Comentário criado com sucesso
        </span>
      )
    }
    return null
  }
  const handleStartEdit = (commentId: number, currentContent: string) => {
    setEditingCommentId(commentId)
    setEditingContent(currentContent)
  }
  const handleCancelEdit = () => {
    setEditingCommentId(null)
    setEditingContent('')
  }
  const handleSaveEdit = async (commentId: number) => {
    if (!editingContent.trim()) {
      alert('O comentário não pode estar vazio')
      return
    }
    try {
      await updateComment(commentId, { content: editingContent.trim() })
      setEditingCommentId(null)
      setEditingContent('')
    } catch (error) {
      console.error('Erro ao atualizar comentário:', error)
    }
  }
  if (isLoading) {
    return (
      <Container>
        <div className="flex justify-center items-center min-h-[400px]">
          <AiOutlineLoading className="animate-spin text-4xl" />
        </div>
      </Container>
    )
  }
  return (
    <Container>
      <div className="w-full md:w-3/4 lg:w-1/2 m-auto rounded p-4">
        <div className="w-full flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 p-4 border-b border-purple-900">
          <Image
            src={postData?.author.avatar || ' '}
            alt={`${postData?.author} avatar`}
            width={32}
            height={32}
            className="w-8 h-8 min-w-8 min-h-8 object-cover rounded-full mr-2 shrink-0"
            unoptimized={isExternalUrl(postData?.author.avatar || ' ')}
          />
          <h2 className="text-sm sm:text-base">{postData?.author.username}</h2>
          <p className="text-purple-900 text-xs sm:text-sm text-center">
            {postData?.updated_at
              ? new Date(postData.updated_at).toLocaleString('pt-BR')
              : ''}
          </p>
        </div>
        <p className="pt-4 text-sm sm:text-base wrap-break-word">
          {postData?.content}
        </p>
      </div>
      <div
        className={`w-full md:w-3/4 lg:w-1/2 m-auto mt-8 ${isCommentCreated ? 'shadow-[0_20px_24px_-22px_rgba(22, 163, 74,1)]' : 'shadow-[0_20px_24px_-22px_rgba(147,51,234,1)]'}  rounded p-2`}
      >
        <Form
          className="border-2 border-gray-900 w-full"
          onSubmit={handleSubmit}
        >
          <textarea
            name=""
            id=""
            className="resize-none border-b border-gray-800 focus:outline-0 w-full"
            placeholder="Comentar Ping"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onFocus={() => setIsCommentCreated(false)}
            rows={4}
          />
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mt-2">
            {creatingCommentaryResponse()}
            <Button type="submit" className="w-full sm:w-auto self-end">
              Comentar
            </Button>
          </div>
        </Form>
      </div>
      <div className="w-full md:w-3/4 lg:w-1/2 m-auto mt-8 p-4">
        {loadingComments ? (
          <AiOutlineLoading className="animate-spin m-auto text-4xl" />
        ) : (
          commentsData &&
          commentsData.results.map((comment) => (
            <div className="p-2 sm:p-4" key={comment.id}>
              <div className="w-full flex flex-wrap items-center gap-2 sm:gap-4 p-2 sm:p-4">
                <Image
                  src={comment?.author.avatar || ' '}
                  alt={`${comment?.author.username} avatar`}
                  width={32}
                  height={32}
                  className="w-8 h-8 min-w-8 min-h-8 object-cover object-center rounded-full mr-2 shrink-0"
                  unoptimized={isExternalUrl(comment?.author.avatar || ' ')}
                />

                <h2 className="text-sm sm:text-base flex-1 min-w-0">
                  {comment?.author.username}
                </h2>
                <p className="text-xs sm:text-sm text-purple-900 text-center">
                  {comment?.updated_at
                    ? new Date(comment.updated_at).toLocaleString('pt-BR')
                    : ''}
                </p>
                {comment.author.username === profileData?.username ? (
                  <div className="flex gap-2">
                    <button
                      className="flex items-center align-center cursor-pointer hover:text-green-600 transition-colors"
                      onClick={() =>
                        handleStartEdit(comment.id, comment.content)
                      }
                      aria-label="Editar comentário"
                    >
                      <MdEditSquare className="text-lg sm:text-xl" />
                    </button>
                    <button
                      className="flex items-center align-center cursor-pointer hover:text-red-600 transition-colors"
                      onClick={() => deleteComment(comment.id)}
                      aria-label="Deletar comentário"
                    >
                      {isDeleting ? (
                        <AiOutlineLoading className="animate-spin text-lg sm:text-xl" />
                      ) : (
                        <MdDeleteForever className="text-lg sm:text-xl" />
                      )}
                    </button>
                  </div>
                ) : null}
              </div>
              {editingCommentId === comment.id ? (
                <div className="mt-2 p-2 border-b border-purple-900">
                  <textarea
                    value={editingContent}
                    onChange={(e) => setEditingContent(e.target.value)}
                    className="w-full resize-none border border-purple-900 rounded p-2 text-sm sm:text-base"
                    rows={3}
                    autoFocus
                  />
                  <div className="flex flex-col sm:flex-row gap-2 mt-2 justify-end">
                    <button
                      onClick={handleCancelEdit}
                      className="bg-red-600 text-white px-4 py-2 rounded cursor-pointer hover:opacity-80 transition-opacity text-sm sm:text-base"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => handleSaveEdit(comment.id)}
                      disabled={isUpdating}
                      className="bg-green-600 text-white px-4 py-2 rounded cursor-pointer hover:opacity-80 transition-opacity disabled:opacity-50 text-sm sm:text-base"
                    >
                      {isUpdating ? 'Salvando...' : 'Salvar'}
                    </button>
                  </div>
                </div>
              ) : (
                <p className="mt-2 p-2 border-b border-purple-900 text-sm sm:text-base wrap-break-word">
                  {comment.content}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </Container>
  )
}
