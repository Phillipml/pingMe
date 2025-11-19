import React, { ReactNode } from "react";

interface CenterContainerProps {
  children: ReactNode;
  className?: string;
}

export default function CenterContainer({ children, className }: CenterContainerProps) {
  return (
    <div className={`min-h-screen flex flex-col justify-center items-center p-4 w-full ${className}`}>
        {children}
    </div>
  );
}


