import { AiFillLike, AiOutlineLike, AiOutlineLoading } from 'react-icons/ai'
import { useNavigation } from '@/hooks/useNavigation'
import {
  MdDeleteForever,
  MdEditSquare,
  MdOutlineInsertComment
} from 'react-icons/md'
type CardProps = {
  children: string
  created_at: string
  onClick: () => void
  clickDelete: () => void
  commentRoute: number | string
  is_liked: boolean
  isDeleting: boolean
  likes_count: number
  comments_count: number
}
export default function UserPostCard({
  children,
  created_at,
  onClick,
  clickDelete,
  commentRoute,
  is_liked,
  isDeleting,
  likes_count,
  comments_count
}: CardProps) {
  const { toComment } = useNavigation()
  return (
    <li className="mt-4 grid pb-2 border-2 border-purple-600 rounded-2xl p-4">
      <div className="flex justify-between border-b border-purple-600 mb-4">
        <div className="w-1/2">
          <p className="text-gray-700 pb-2">
            {new Date(created_at).toLocaleString('pt-BR')}
          </p>
        </div>
        <div className="w-full flex items-center justify-end mb-4 gap-4 ">
          <button className="text-sm flex items-center align-center cursor-pointer hover:text-green-600">
            <MdEditSquare />
            Editar
          </button>
          <button
            className="text-sm flex items-center align-center cursor-pointer hover:text-red-600"
            onClick={clickDelete}
          >
            {isDeleting ? (
              <AiOutlineLoading className="animate-spin" />
            ) : (
              <MdDeleteForever />
            )}
            Deletar
          </button>
        </div>
      </div>
      <div className="pb-4 border-b border-purple-950">{children}</div>
      <div className="flex justify-around">
        <button
          className="flex items-center justify-center gap-1 cursor-pointer"
          onClick={onClick}
        >
          {is_liked ? <AiFillLike /> : <AiOutlineLike />}
          {likes_count}
        </button>
        <button
          className="flex items-center justify-center gap-1 cursor-pointer"
          onClick={() => toComment(commentRoute)}
        >
          <MdOutlineInsertComment />
          {comments_count}
        </button>
      </div>
    </li>
  )
}
