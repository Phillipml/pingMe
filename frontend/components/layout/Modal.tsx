import { IoMdCloseCircleOutline } from 'react-icons/io'

type Modal = {
  children: React.ReactNode
  isOpen: boolean
  onClose: () => void
}
export default function Modal({ children, isOpen, onClose }: Modal) {
  if (!isOpen) return null
  return (
    <>
      <button
        className="z-50 flex items-center justify-center fixed top-1/4 left-3/4 -translate-x-1/2 -translate-y-1/2 rounded-full w-8 h-8 cursor-pointer"
        onClick={onClose}
      >
        <IoMdCloseCircleOutline className="text-3xl bg-red-600 rounded-full" />
      </button>
      <div className="z-40 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-700 scrollbar-track-gray-950 w-1/2 h-1/2 rounded bg-purple-950 border border-white">
        {children}
      </div>
    </>
  )
}
