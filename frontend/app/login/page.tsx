"use client"
import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Logo } from "@/components/ui/Logo";
import { useLoginMutation } from "@/lib/slice";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error,setError] = useState("");
  const [login, {isLoading}]= useLoginMutation();
  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault();
    setError("")
    try {
      await login({email, password}).unwrap();
      router.push('/feed')

    } catch (err: unknown) {
      const error = err as { data?: { error?: string; message?: string } };
      setError(error?.data?.error || error?.data?.message || "Erro ao fazer login, favor. Verifique suas credenciais");
    }
  }
  return (
    <Container>
       <div className="flex flex-col justify-center items-center fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 w-full lg:w-1/2">
        <Logo className="text-2xl m-auto border-b-2 border-violet-600 pb-2 mb-8 mt-2" />
        <h2 className="mb-8 text-center">Login</h2>
        <form onSubmit={handleSubmit} className="flex flex-col items-center w-full">
          {error && ( <div>{error}</div> )}
        <Input
          type="text"
          className="w-5/6 text-center lg:w-1/2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Email"
        />
        <Input
          type="password"
          className="w-5/6 text-center lg:w-1/2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Senha"
        />
        <Button type="submit" className="w-5/6 lg:w-1/2" disabled={isLoading}>Entrar</Button>
        </form>
      </div>
    </Container>
  );
}
