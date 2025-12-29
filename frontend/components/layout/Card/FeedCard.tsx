import { useNavigation } from '@/hooks/useNavigation'
import Link from 'next/link'
import Image from 'next/image'
import { isExternalUrl } from '@/utils/api-utils'
import { AiFillLike, AiOutlineLike } from 'react-icons/ai'
import { MdOutlineInsertComment } from 'react-icons/md'
type CardProps = {
  children: string
  href: string
  img: string
  alt: string
  author: string
  created_at: string
  onClick: () => void
  commentRoute: number | string
  is_liked: boolean
  likes_count: number
  comments_count: number
}
export default function FeedCard({
  children,
  href,
  img,
  alt,
  author,
  created_at,
  onClick,
  commentRoute,
  is_liked,
  likes_count,
  comments_count
}: CardProps) {
  const { toComment } = useNavigation()
  return (
    <li className="w-full md:w-2/3 lg:w-1/2 xl:w-1/3 mt-4 grid pb-2">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
        <Link href={href} className="flex items-center justify-center">
          <Image
            src={img || ' '}
            alt={alt}
            width={32}
            height={32}
            className="w-8 h-8 min-w-8 min-h-8 object-cover rounded-full mr-2 shrink-0"
            unoptimized={isExternalUrl(img || ' ')}
          />
          <h2 className="text-sm sm:text-base">@{author}</h2>
        </Link>
        <p className="text-purple-900 text-xs sm:text-sm">
          {new Date(created_at).toLocaleString('pt-BR')}
        </p>
      </div>
      <div className="border-b border-purple-950 pb-4 text-sm sm:text-base wrap-break-word">
        {children}
      </div>
      <div className="flex justify-around mt-2">
        <button
          className="flex items-center justify-center gap-1 cursor-pointer text-sm sm:text-base hover:opacity-80 transition-opacity"
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
          className="flex items-center justify-center gap-1 cursor-pointer text-sm sm:text-base hover:opacity-80 transition-opacity"
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
