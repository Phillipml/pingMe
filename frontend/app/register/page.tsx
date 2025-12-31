'use client'
import CenterContainer from '@/components/layout/CenterContainer'
import Form from '@/components/layout/Form'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Logo } from '@/components/ui/Logo'
import { useRegisterMutation } from '@/lib/slice'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Register() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [register, { isLoading }] = useRegisterMutation()
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password !== confirmPassword) {
      alert('As senhas não são iguais')
      setPassword('')
      setConfirmPassword('')
    } else if (username.length > 0 && username.length <= 3) {
      alert('username deve conter pelo menos 3 letras')
    } else if (password.length > 0 && password.length <= 5) {
      alert('senha deve conter pelo menos 6 caracteres')
    } else {
      try {
        await register({ username, email, password }).unwrap()
        router.push('/user-created')
      } catch (err: unknown) {
        const error = err as { data?: Record<string, string[] | string> }
        if (!error?.data) {
          setError('Erro ao criar conta. Verifique os dados informados.')
          return
        }
        const fields = ['username', 'email', 'password'] as const
        for (const field of fields) {
          if (error.data[field]) {
            const fieldError = error.data[field]
            const message = Array.isArray(fieldError)
              ? fieldError[0]
              : fieldError
            setError(String(message))
            return
          }
        }
        const firstError = Object.values(error.data).find((val) => val)
        if (firstError) {
          const message = Array.isArray(firstError) ? firstError[0] : firstError
          setError(String(message))
          return
        }
      }
    }
    setError('Erro ao criar conta. Verifique os dados informados.')
  }

  return (
    <CenterContainer>
      <div className="w-full max-w-md border-2 border-violet-600 rounded-md p-4 sm:p-6 md:p-8 text-center mx-4">
        <Logo className="text-xl sm:text-2xl mx-auto justify-center border-b-2 border-violet-600 pb-2 mb-6 sm:mb-8 mt-2" />
        <h2 className="mb-6 sm:mb-8 text-center text-sm sm:text-base px-2">
          Seja bem vindo ao PingMe!
          <br />
          Crie sua conta para fazer o seu primeiro ping.
        </h2>
        <Form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-4 text-red-500 text-sm text-center p-2 bg-red-500/10 rounded">
              {error}
            </div>
          )}
          <Input
            placeholder="*Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="text-sm sm:text-base"
            required
          />
          <Input
            type="email"
            placeholder="*Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="text-sm sm:text-base"
            required
          />
          <Input
            type="password"
            value={password}
            placeholder="*Password"
            onChange={(e) => setPassword(e.target.value)}
            className="text-sm sm:text-base"
            required
          />
          <Input
            type="password"
            value={confirmPassword}
            placeholder="*Confirm Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="text-sm sm:text-base"
            required
          />
          <Button
            type="submit"
            className="w-full text-sm sm:text-base"
            disabled={isLoading}
            loading={isLoading}
          >
            Criar
          </Button>
        </Form>
      </div>
    </CenterContainer>
  )
}
