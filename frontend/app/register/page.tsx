"use client"
import CenterContainer from "@/components/layout/CenterContainer"
import Form from "@/components/layout/Form"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { Logo } from "@/components/ui/Logo"
import { useState } from "react"

export default function Register() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  return (
    <CenterContainer>
      <Logo className="text-2xl m-auto border-b-2 border-violet-600 pb-2 mb-8 mt-2" />
      Register
      <Form>
      <Input placeholder="*Username" value={username} onChange={e => setUsername(e.target.value)}/>
      <Input placeholder="*Email " value={email} onChange={e=> setEmail(e.target.value)}/>
      <Input type="password" value={password} placeholder="*Password" onChange={e => setPassword(e.target.value)}/>
      <Button type="submit" className="w-5/6 lg:w-1/2">Criar</Button>
      </Form>
    </CenterContainer>
  )
}

