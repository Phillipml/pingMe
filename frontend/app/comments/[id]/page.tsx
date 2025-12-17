'use client'
import Container from '@/components/layout/Container'
import {
  useGetCommentsQuery,
  useGetPostQuery,
  useGetProfileQuery
} from '@/lib/slice'
import { useParams } from 'next/navigation'
import { AiOutlineLoading } from 'react-icons/ai'
import { MdDeleteForever, MdEditSquare } from 'react-icons/md'

export default function Comments() {
  const params = useParams()
  const postId = params.id as string
  const { data: postData, isLoading } = useGetPostQuery(postId)
  const { data: commentsData, isLoading: loadingComments } =
    useGetCommentsQuery(postId)
  const { data: profileData } = useGetProfileQuery()

  if (isLoading) {
    return 'Carregando'
  }
  return (
    <Container>
      <div className="w-1/2 m-auto rounded p-4 shadow-[0_22px_8px_-22px_rgba(147,51,234,1)]">
        <div className="w-full flex justify-center items-center gap-4 p-4 border-b border-purple-600">
          <img
            src={postData?.author.avatar || ' '}
            alt={`${postData?.author} avatar`}
            className="w-8 h-8 object-cover rounded-full mr-2"
          />
          <h2>{postData?.author.username}</h2>
          <h2 className="text-purple-600 text-center">
            {postData?.updated_at
              ? new Date(postData.updated_at).toLocaleString('pt-BR')
              : ''}
          </h2>
        </div>
        <h2 className="pt-4">{postData?.content}</h2>
      </div>
      <div className="w-1/2 m-auto mt-8 border-l border-r border-purple-600 pr-4 pl-4">
        {loadingComments ? (
          <AiOutlineLoading className="animate-spin m-auto text-4xl" />
        ) : (
          commentsData &&
          commentsData.results.map((comment) => (
            <div className="p-4 border-b border-purple-600" key={comment.id}>
              <div className="w-full flex justify-center items-center gap-4 p-4 border-b border-purple-600">
                <img
                  src={comment?.author.avatar || ' '}
                  alt={`${comment?.author.username} avatar`}
                  className="w-8 h-8 min-w-8 min-h-8 object-cover object-center rounded-full mr-2 shrink-0"
                />
                <h2>{comment?.author.username}</h2>
                <h2 className="text-purple-600 text-center">
                  {comment?.updated_at
                    ? new Date(comment.updated_at).toLocaleString('pt-BR')
                    : ''}
                </h2>

                {comment.author.username === profileData?.username ? (
                  <div className="flex gap-2">
                    <button className="flex items-center align-center cursor-pointer hover:text-green-600">
                      <MdEditSquare />
                    </button>
                    <button className="flex items-center align-center cursor-pointer hover:text-red-600">
                      <MdDeleteForever />
                    </button>
                  </div>
                ) : null}
              </div>
              {comment.content}
            </div>
          ))
        )}
      </div>
    </Container>
  )
}
