import React, { ReactNode } from 'react'

interface CenterContainerProps {
  children: ReactNode
  className?: string
}

export default function CenterContainer({
  children,
  className
}: CenterContainerProps) {
  return (
    <div
      className={`flex flex-col justify-center items-center p-3 sm:p-4 md:p-6 w-full ${className}`}
      style={{ minHeight: '100dvh' }}
    >
      {children}
    </div>
  )
}
