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
  clickEdit?: () => void
  commentRoute: number | string
  is_liked: boolean
  isDeleting: boolean
  isEditing?: boolean
  editingContent?: string
  onEditingContentChange?: (content: string) => void
  onSaveEdit?: () => void
  onCancelEdit?: () => void
  isUpdating?: boolean
  likes_count: number
  comments_count: number
  showActions?: boolean
}
export default function UserPostCard({
  children,
  created_at,
  onClick,
  clickDelete,
  clickEdit,
  commentRoute,
  is_liked,
  isDeleting,
  isEditing = false,
  editingContent = '',
  onEditingContentChange,
  onSaveEdit,
  onCancelEdit,
  isUpdating = false,
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
        {showActions && !isEditing && (
          <div className="w-full sm:w-auto flex items-center justify-start sm:justify-end gap-2 sm:gap-4">
            <button
              className="text-xs sm:text-sm flex items-center align-center cursor-pointer hover:text-green-600 transition-colors gap-1"
              onClick={clickEdit}
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
      {isEditing ? (
        <div className="pb-4 border-b border-purple-950">
          <textarea
            value={editingContent}
            onChange={(e) => onEditingContentChange?.(e.target.value)}
            className="w-full resize-none border border-purple-900 rounded p-2 text-sm sm:text-base"
            rows={3}
            autoFocus
          />
          <div className="flex flex-col sm:flex-row gap-2 mt-2 justify-end">
            <button
              onClick={onCancelEdit}
              className="bg-red-600 text-white px-4 py-2 rounded cursor-pointer hover:opacity-80 transition-opacity text-sm sm:text-base"
            >
              Cancelar
            </button>
            <button
              onClick={onSaveEdit}
              disabled={isUpdating}
              className="bg-green-600 text-white px-4 py-2 rounded cursor-pointer hover:opacity-80 transition-opacity disabled:opacity-50 text-sm sm:text-base"
            >
              {isUpdating ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </div>
      ) : (
        <div className="pb-4 border-b border-purple-950 text-sm sm:text-base wrap-break-word">
          {children}
        </div>
      )}
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
