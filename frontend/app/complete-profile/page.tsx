'use client'
import CenterContainer from '@/components/layout/CenterContainer'
import Form from '@/components/layout/Form'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Logo } from '@/components/ui/Logo'
import { useUpdateProfileMutation } from '@/lib/slice'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function CompleteProfile() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [lastname, setLastname] = useState('')
  const [bio, setBio] = useState('')
  const [avatar, setAvatar] = useState<File | null>(null)
  const [error, setError] = useState('')
  const [updateProfile, { isLoading }] = useUpdateProfileMutation()
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      const formData = new FormData()
      formData.append('first_name', name)
      formData.append('last_name', lastname)
      formData.append('bio', bio)
      if (avatar) formData.append('avatar', avatar)
      formData.append('status', '1')
      await updateProfile(formData).unwrap()
      router.push('/feed')
    } catch (err: unknown) {
      const error = err as { data?: { error?: string; message?: string } }
      setError(
        error?.data?.error || error.data?.message || 'Erro ao atualizar perfil'
      )
    }
    3
  }
  return (
    <CenterContainer className="grid justify-center">
      <div className="w-full max-w-md border-2 border-violet-600 rounded-md p-2">
        <Logo className="text-2xl mx-auto justify-center border-b-2 border-violet-600 pb-2 mb-8 mt-2" />
        <h2 className="text-center">
          Hora de iniciar sua história aqui com a gente!
          <br />
          Vamos completar o seu perfil!
        </h2>
        <Form onSubmit={handleSubmit}>
          <Input
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            placeholder="Sobrenome"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
          />
          <Input
            placeholder="Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setAvatar(e.target.files?.[0] || null)}
            required
          />
          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

          <Button type="submit" disabled={isLoading} loading={isLoading}>
            Salvar
          </Button>
        </Form>
      </div>
    </CenterContainer>
  )
}
