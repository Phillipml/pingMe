interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  className?: string
  colorVariant?: 'default' | 'red'
}
const Button = ({
  children,
  className,
  colorVariant = 'default',
  ...props
}: ButtonProps) => {
  const setColorVariant = {
    default: 'bg-violet-800 hover:bg-violet-600',
    red: 'bg-red-800 hover:bg-red-600'
  }
  return (
    <button
      className={`p-4 rounded text-center ${setColorVariant[colorVariant]}  cursor-pointer mt-4 mb-4 transition ${
        className ?? ''
      }`}
      {...props}
    >
      {children}
    </button>
  )
}
export default Button
