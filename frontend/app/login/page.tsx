'use client'
import CenterContainer from '@/components/layout/CenterContainer'
import Form from '@/components/layout/Form'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Logo } from '@/components/ui/Logo'
import { useLoginMutation } from '@/lib/slice'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [login, { isLoading }] = useLoginMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      const response = await login({ email, password }).unwrap()

      if (typeof window !== 'undefined') {
        if (response.access) {
          localStorage.setItem('accessToken', response.access)
        }
        if (response.refresh) {
          localStorage.setItem('refreshToken', response.refresh)
        }
      }

      const userStatus = response.user.info.status
      if (userStatus == 0) {
        router.push('/complete-profile')
      } else {
        router.push('/feed')
      }
    } catch (err: unknown) {
      const error = err as { data?: { error?: string; message?: string } }
      setError(
        error?.data?.error ||
          error?.data?.message ||
          'Erro ao fazer login, favor. Verifique suas credenciais'
      )
    }
  }

  return (
    <CenterContainer>
      <div className="w-full max-w-md border-2 border-violet-600 rounded-md p-3 sm:p-4">
        <Logo className="text-xl sm:text-2xl mx-auto justify-center border-b-2 border-violet-600 pb-2 mb-4 sm:mb-8 mt-2" />
        <h2 className="mb-4 sm:mb-8 text-center text-lg sm:text-xl">Login</h2>
        <Form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          {error && (
            <div className="text-red-500 text-sm text-center p-2 bg-red-500/10 rounded">
              {error}
            </div>
          )}
          <Input
            type="email"
            className="w-full text-center"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Email"
          />
          <Input
            type="password"
            className="w-full text-center"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Senha"
          />
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
            loading={isLoading}
          >
            Entrar
          </Button>
          <p className="text-center sm:text-end text-sm">
            Não tem conta?{' '}
            <Link href="/register" className="underline">
              Registre-se
            </Link>
          </p>
        </Form>
      </div>
    </CenterContainer>
  )
}
