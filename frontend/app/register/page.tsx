"use client"
import CenterContainer from "@/components/layout/CenterContainer"
import Form from "@/components/layout/Form"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { Logo } from "@/components/ui/Logo"
import { useRegisterMutation } from "@/lib/slice"
import { useRouter } from "next/navigation"
import { useState } from "react"


export default function Register() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error,setError] = useState("")
  const [register,{isLoading}]=useRegisterMutation()
  const handleSubmit=async(e:React.FormEvent)=>{
    e.preventDefault();
    setError("");
    try {
      await register ({username, email, password}).unwrap()
      router.push("/user-created")
      
    } catch (err: unknown) {
      const error = err as { data?: { error?: string; message?: string } }
      setError(error?.data?.error || error?.data?.message || "Erro ao criar conta. Verifique os dados informados.")
    }

  }

  return (
    
    <CenterContainer>
      <Logo className="text-2xl m-auto border-b-2 border-violet-600 pb-2 mb-8 mt-2" />
      Register
      <Form onSubmit={handleSubmit}>
      {error && ( <div>{error}</div> )}
      <Input placeholder="*Username" value={username} onChange={e => setUsername(e.target.value)} required/>
      <Input type="email" placeholder="*Email " value={email} onChange={e=> setEmail(e.target.value)} required/>
      <Input type="password" value={password} placeholder="*Password" onChange={e => setPassword(e.target.value)} required/>
      <Button type="submit" className="w-5/6 lg:w-1/2" disabled={isLoading}>Criar</Button>
      </Form>
    </CenterContainer>
  )
}

