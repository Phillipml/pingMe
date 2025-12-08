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
import { AiFillLike, AiOutlineLike, AiOutlineLoading } from 'react-icons/ai'
import { MdOutlineInsertComment } from 'react-icons/md'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '@/lib/store'
import Link from 'next/link'

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
  const dispatch = useDispatch<AppDispatch>() // Adicionar tipo genérico

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
        className={`w-1/3 m-auto border-2 ${isPostCreated ? 'border-green-600' : 'border-purple-600'}  rounded p-2`}
      >
        <Form className="border-2 border-gray-900" onSubmit={createPost}>
          <textarea
            name=""
            id=""
            className="resize-none border-b border-gray-800 focus:outline-0"
            placeholder="Criar Ping"
            value={post}
            onChange={(e) => setPost(e.target.value)}
            onFocus={() => setIsPostCreated(false)}
          />
          <div className="flex justify-between items-center mt-2">
            {isPostCreated ? (
              <span className="text-white bg-green-600 p-2 rounded-2xl">
                Post Criado com sucesso
              </span>
            ) : null}
            <Button type="submit" className="w-1/3 self-end">
              Criar Ping
            </Button>
          </div>
        </Form>
      </div>
      <div>
        <ul className="flex flex-col justify-center items-center">
          {data &&
            data.results.map((post) => (
              <li className="w-1/3  mt-4 grid pb-2" key={post.id}>
                <div className="flex justify-between ">
                  <Link
                    href={`/user-profile/${post.author.id}`}
                    className="flex items-center justify-center mb-4"
                  >
                    <img
                      src={post.author.avatar || ' '}
                      alt=""
                      className="w-8 h-8 object-cover rounded-full mr-2"
                    />
                    <h2>@{post.author.username}</h2>
                  </Link>
                  <p className="text-gray-700">
                    {new Date(post.author.created_at).toLocaleString('pt-BR')}
                  </p>
                </div>
                <div className="border-b border-purple-950">{post.content}</div>
                <div className="flex justify-around">
                  <button
                    className="flex items-center justify-center gap-1 cursor-pointer"
                    onClick={() => likePost(post.id)}
                  >
                    {post.is_liked ? <AiFillLike /> : <AiOutlineLike />}
                    {post.likes_count}
                  </button>
                  <button className="flex items-center justify-center gap-1">
                    <MdOutlineInsertComment />
                    {post.comments_count}
                  </button>
                </div>
              </li>
            ))}
        </ul>
      </div>
    </Container>
  )
}
