'use client'
import Container from '@/components/layout/Container'
import Form from '@/components/layout/Form'
import Button from '@/components/ui/Button'
import { useCreatePostMutation, useFeedQuery } from '@/lib/slice'
import { useState } from 'react'
import { AiFillLike, AiOutlineLike } from 'react-icons/ai'
import { MdOutlineInsertComment } from 'react-icons/md'

export default function Feed() {
  const [post, setPost] = useState('')
  const [isPostCreated, setIsPostCreated] = useState(false)
  const [postData] = useCreatePostMutation()
  const { data } = useFeedQuery()
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
              <li className="w-1/3  mt-4 grid pb-2">
                <div className="flex justify-between ">
                  <div className="flex items-center justify-center mb-4">
                    <img
                      src={post.author.avatar || ' '}
                      alt=""
                      className="w-8 h-8 object-cover rounded-full mr-2"
                    />
                    <h2>@{post.author.username}</h2>
                  </div>
                  <p className="text-gray-700">
                    {new Date(post.author.created_at).toLocaleString('pt-BR')}
                  </p>
                </div>
                <div className="border-b border-purple-950">{post.content}</div>
                <div className="flex justify-around">
                  <button className="flex items-center justify-center gap-1">
                    <AiOutlineLike />
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
