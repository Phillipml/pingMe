import { AiOutlineLoading } from 'react-icons/ai'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  className?: string
  colorVariant?: 'default' | 'red'
  loading?: boolean
}
const Button = ({
  children,
  className,
  colorVariant = 'default',
  loading = false,
  ...props
}: ButtonProps) => {
  const setColorVariant = {
    default: 'bg-violet-800 hover:bg-violet-600',
    red: 'bg-red-800 hover:bg-red-600'
  }
  return (
    <button
      className={`p-2 rounded text-center ${setColorVariant[colorVariant]} cursor-pointer transition ${
        className ?? ''
      }`}
      {...props}
    >
      {loading ? (
        <AiOutlineLoading className="animate-spin m-auto" />
      ) : (
        children
      )}
    </button>
  )
}
export default Button
