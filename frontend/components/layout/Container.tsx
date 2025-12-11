import React from 'react'
type ContainerProps = {
  children: React.ReactNode
  className?: string
}

export default function Container({ children, className }: ContainerProps) {
  return (
    <div className={`w-full max-w-[1400px] h-auto p-4 mx-auto ${className}`}>
      {children}
    </div>
  )
}
