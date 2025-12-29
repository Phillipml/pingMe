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
  showActions?: boolean
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
  comments_count,
  showActions = false
}: CardProps) {
  const { toComment } = useNavigation()
  return (
    <li className="mt-4 grid pb-2 border-2 border-purple-600 rounded-2xl p-3 sm:p-4">
      <div className="flex flex-col sm:flex-row justify-between border-b border-purple-600 mb-4 gap-2">
        <div className="w-full sm:w-1/2">
          <p className="text-gray-700 pb-2 text-xs sm:text-sm">
            {new Date(created_at).toLocaleString('pt-BR')}
          </p>
        </div>
        {showActions && (
          <div className="w-full sm:w-auto flex items-center justify-start sm:justify-end gap-2 sm:gap-4">
            <button
              className="text-xs sm:text-sm flex items-center align-center cursor-pointer hover:text-green-600 transition-colors gap-1"
              aria-label="Editar post"
            >
              <MdEditSquare className="text-base sm:text-lg" />
              <span>Editar</span>
            </button>
            <button
              className="text-xs sm:text-sm flex items-center align-center cursor-pointer hover:text-red-600 transition-colors gap-1"
              onClick={clickDelete}
              aria-label="Deletar post"
            >
              {isDeleting ? (
                <AiOutlineLoading className="animate-spin text-base sm:text-lg" />
              ) : (
                <MdDeleteForever className="text-base sm:text-lg" />
              )}
              <span>Deletar</span>
            </button>
          </div>
        )}
      </div>
      <div className="pb-4 border-b border-purple-950 text-sm sm:text-base wrap-break-word">
        {children}
      </div>
      <div className="flex justify-around mt-2">
        <button
          className="flex items-center justify-center gap-1 cursor-pointer hover:opacity-80 transition-opacity text-sm sm:text-base"
          onClick={onClick}
          aria-label={is_liked ? 'Descurtir post' : 'Curtir post'}
        >
          {is_liked ? (
            <AiFillLike className="text-lg sm:text-xl" />
          ) : (
            <AiOutlineLike className="text-lg sm:text-xl" />
          )}
          <span>{likes_count}</span>
        </button>
        <button
          className="flex items-center justify-center gap-1 cursor-pointer hover:opacity-80 transition-opacity text-sm sm:text-base"
          onClick={() => toComment(commentRoute)}
          aria-label="Ver comentários"
        >
          <MdOutlineInsertComment className="text-lg sm:text-xl" />
          <span>{comments_count}</span>
        </button>
      </div>
    </li>
  )
}
