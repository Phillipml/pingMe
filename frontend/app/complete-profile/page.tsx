'use client'
import CenterContainer from '@/components/layout/CenterContainer'
import Form from '@/components/layout/Form'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Logo } from '@/components/ui/Logo'
import { useState } from 'react'

export default function CompleteProfile() {
  const [username, setUsername] = useState('')
  const [name, setName] = useState('')
  const [lastname, setLastname] = useState('')
  const [bio, setBio] = useState('')
  return (
    <CenterContainer className="grid justify-center">
      <div className="w-full max-w-md border-2 border-violet-600 rounded-md p-4">
        <Logo className="text-2xl mx-auto justify-center border-b-2 border-violet-600 pb-2 mb-8 mt-2" />
        <h2 className="text-center">
          Hora de iniciar sua história aqui com a gente!
          <br />
          Vamos completar o seu perfil!
        </h2>
        <Form>
          <Input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
          <Button>Foto perfil</Button>
        </Form>
      </div>
    </CenterContainer>
  )
}
