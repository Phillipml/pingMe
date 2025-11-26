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
    <CenterContainer>
      <h2 className="text-center">Complete your Profile</h2>
      <Logo className="text-2xl border-b-2 border-violet-600 pb-2 mb-8 mt-2" />
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
    </CenterContainer>
  )
}
