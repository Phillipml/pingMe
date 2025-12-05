'use client'
import Container from '@/components/layout/Container'
import Form from '@/components/layout/Form'
import Button from '@/components/ui/Button'
import { useCreatePostMutation } from '@/lib/slice'
import { useState } from 'react'

export default function Feed() {
  const [post, setPost] = useState('')
  const [isPostCreated, setIsPostCreated] = useState(false)
  const [postData] = useCreatePostMutation()
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
    </Container>
  )
}
