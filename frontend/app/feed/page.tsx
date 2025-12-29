'use client'
import CenterContainer from '@/components/layout/CenterContainer'
import Container from '@/components/layout/Container'
import Form from '@/components/layout/Form'
import Button from '@/components/ui/Button'
import {
  apiSlice,
  useCreatePostMutation,
  useFeedQuery,
  useLikePostMutation
} from '@/lib/slice'
import { useState } from 'react'
import { AiOutlineLoading } from 'react-icons/ai'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '@/lib/store'
import FeedCard from '@/components/layout/Card/FeedCard'

export default function Feed() {
  const [post, setPost] = useState('')
  const [isPostCreated, setIsPostCreated] = useState(false)
  const [postData] = useCreatePostMutation()
  const { data, isLoading } = useFeedQuery()
  const [like, error] = useLikePostMutation()
  const createPost = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await postData({ content: post }).unwrap()
      setPost('')
      setIsPostCreated(true)
    } catch (error) {
      const err = error as { data?: { error?: string; message?: string } }
      alert(err?.data?.error || err?.data?.message || 'Erro ao fazer post')
      setIsPostCreated(false)
    }
  }
  const dispatch = useDispatch<AppDispatch>()

  const likePost = async (id: number) => {
    try {
      const response = await like(id).unwrap()

      dispatch(
        apiSlice.util.updateQueryData('feed', undefined, (draft) => {
          const postToUpdate = draft.results.find((p) => p.id === id)
          if (postToUpdate) {
            postToUpdate.is_liked = response.liked
            postToUpdate.likes_count = response.likes_count
          }
        })
      )
    } catch (error) {
      const err = error as { data?: { error?: string; message?: string } }
      alert(err?.data?.error || err?.data?.message || 'Erro ao curtir post')
    }
  }

  if (isLoading) {
    return (
      <CenterContainer>
        <AiOutlineLoading className="animate-spin m-auto text-4xl" />
      </CenterContainer>
    )
  }
  return (
    <Container>
      <div
        className={`w-full md:w-3/4 lg:w-1/2 m-auto mt-8 ${isPostCreated ? 'shadow-[0_0px_64px_-22px_rgba(22,163,74,1)]' : 'shadow-[0_0px_64px_-22px_rgba(147,51,234,1)]'}  rounded p-2`}
      >
        <Form className="border-2 border-gray-900" onSubmit={createPost}>
          <textarea
            name=""
            id=""
            className="resize-none border-b border-gray-800 focus:outline-0 w-full"
            placeholder="Criar Ping"
            value={post}
            onChange={(e) => setPost(e.target.value)}
            onFocus={() => setIsPostCreated(false)}
            rows={4}
          />
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mt-2">
            {isPostCreated ? (
              <span className="text-green-600 text-sm sm:text-base">
                Ping criado com sucesso
              </span>
            ) : null}
            <Button
              type="submit"
              className="w-full sm:w-auto sm:w-1/3 self-end"
            >
              Criar Ping
            </Button>
          </div>
        </Form>
      </div>
      <div className="mt-8">
        <ul className="flex flex-col justify-center items-center">
          {data &&
            data.results.map((post) => (
              <FeedCard
                href={`/user-profile/${post.author.id}`}
                key={post.id}
                img={post.author.avatar || ' '}
                alt={`${post.author.username}'s avatar`}
                author={post.author.username}
                created_at={post.created_at}
                onClick={() => likePost(post.id)}
                commentRoute={post.id}
                is_liked={post.is_liked}
                comments_count={post.comments_count}
                likes_count={post.likes_count}
              >
                {post.content}
              </FeedCard>
            ))}
        </ul>
      </div>
    </Container>
  )
}
