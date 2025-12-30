import { IoMdCloseCircleOutline } from 'react-icons/io'

type Modal = {
  children: React.ReactNode
  isOpen: boolean
  onClose: () => void
}
export default function Modal({ children, isOpen, onClose }: Modal) {
  if (!isOpen) return null
  return (
    <div className="z-50 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-700 scrollbar-track-gray-950 w-1/2 h-1/2 rounded bg-purple-950 border border-white">
      <button
        className="flex items-center justify-center absolute top-4 right-4 rounded-full w-8 h-8 cursor-pointer"
        onClick={onClose}
      >
        <IoMdCloseCircleOutline className="w-full h-full bg-red-600 rounded-full" />
      </button>
      {children}
    </div>
  )
}
