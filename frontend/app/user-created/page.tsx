import CenterContainer from '@/components/layout/CenterContainer'
import Button from '@/components/ui/Button'
import Link from 'next/link'
import React from 'react'

export default function UserCreated() {
  return (
    <CenterContainer><h2>Obrigado por entrar para a família PingMe.</h2>
    <p>Que tal fazer seu primeiro ping?</p>
    <Link href="/login">
    <Button>Login</Button></Link>
    </CenterContainer>
  )
}
