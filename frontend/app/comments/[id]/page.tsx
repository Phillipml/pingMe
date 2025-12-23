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
        <span className="text-white bg-green-600 p-2 rounded-2xl">
          Comentando...
        </span>
      )
    }
    if (isCommentCreated) {
      return (
        <span className="text-white bg-green-600 p-2 rounded-2xl">
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
    return 'Carregando'
  }
  return (
    <Container>
      <div className="w-1/2 m-auto rounded p-4">
        <div className="w-full flex justify-center items-center gap-4 p-4 border-b border-purple-900">
          <img
            src={postData?.author.avatar || ' '}
            alt={`${postData?.author} avatar`}
            className="w-8 h-8 object-cover rounded-full mr-2"
          />
          <h2>{postData?.author.username}</h2>
          <h2 className="text-purple-900 text-center">
            {postData?.updated_at
              ? new Date(postData.updated_at).toLocaleString('pt-BR')
              : ''}
          </h2>
        </div>
        <h2 className="pt-4">{postData?.content}</h2>
      </div>
      <div
        className={`w-1/2 m-auto mt-8 ${isCommentCreated ? 'shadow-[0_20px_24px_-22px_rgba(22, 163, 74,1)]' : 'shadow-[0_20px_24px_-22px_rgba(147,51,234,1)]'}  rounded p-2`}
      >
        <Form
          className="border-2 border-gray-900 w-1/2"
          onSubmit={handleSubmit}
        >
          <textarea
            name=""
            id=""
            className="resize-none border-b border-gray-800 focus:outline-0"
            placeholder="Comentar Ping"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onFocus={() => setIsCommentCreated(false)}
          />
          <div className="flex justify-between items-center mt-2">
            {creatingCommentaryResponse()}
            <Button type="submit" className="w-1/3 self-end">
              Comentar
            </Button>
          </div>
        </Form>
      </div>
      <div className="w-1/2 m-auto mt-8 p-4">
        {loadingComments ? (
          <AiOutlineLoading className="animate-spin m-auto text-4xl" />
        ) : (
          commentsData &&
          commentsData.results.map((comment) => (
            <div className="p-4" key={comment.id}>
              <div className="w-full flex items-center gap-4 p-4">
                <img
                  src={comment?.author.avatar || ' '}
                  alt={`${comment?.author.username} avatar`}
                  className="w-8 h-8 min-w-8 min-h-8 object-cover object-center rounded-full mr-2 shrink-0"
                />

                <h2>{comment?.author.username}</h2>
                <p className="text-sm text-purple-900 text-center">
                  {comment?.updated_at
                    ? new Date(comment.updated_at).toLocaleString('pt-BR')
                    : ''}
                </p>
                {comment.author.username === profileData?.username ? (
                  <div className="flex gap-2">
                    <button
                      className="flex items-center align-center cursor-pointer hover:text-green-600"
                      onClick={() =>
                        handleStartEdit(comment.id, comment.content)
                      }
                    >
                      <MdEditSquare />
                    </button>
                    <button
                      className="flex items-center align-center cursor-pointer hover:text-red-600"
                      onClick={() => deleteComment(comment.id)}
                    >
                      {isDeleting ? (
                        <AiOutlineLoading className="animate-spin" />
                      ) : (
                        <MdDeleteForever />
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
                    className="w-full resize-none border border-purple-900 rounded p-2"
                    rows={3}
                    autoFocus
                  />
                  <div className="flex gap-2 mt-2 justify-end ">
                    <button
                      onClick={handleCancelEdit}
                      className="bg-red-600 p-1 rounded cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => handleSaveEdit(comment.id)}
                      disabled={isUpdating}
                      className="bg-green-600 p-1 rounded cursor-pointer"
                    >
                      {isUpdating ? 'Salvando...' : 'Salvar'}
                    </button>
                  </div>
                </div>
              ) : (
                <p className="mt-2 p-2 border-b border-purple-900">
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
