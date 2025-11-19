import React, { ReactNode, FormHTMLAttributes } from "react";

interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  children: ReactNode;
  className?: string
}

export default function Form({ children,className, ...props }: FormProps) {
  return (
    <form className={`flex flex-col w-full p-2 ${className}`} {...props}>
      {children}
    </form>
  );
}
