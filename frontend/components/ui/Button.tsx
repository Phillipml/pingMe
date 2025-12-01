interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  className?: string
}
const Button = ({ children, className, ...props }: ButtonProps) => {
  return (
    <button
      className={`p-4 rounded text-center bg-violet-800 hover:bg-violet-600 cursor-pointer mt-4 mb-4 transition ${
        className ?? ''
      }`}
      {...props}
    >
      {children}
    </button>
  )
}
export default Button
