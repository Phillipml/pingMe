import Link from 'next/link'
import { AiFillLike, AiOutlineLike } from 'react-icons/ai'
import { MdOutlineInsertComment } from 'react-icons/md'
type CardProps = {
  children: string
  key: string | number
  href: string
  img: string
  alt: string
  author: string
  created_at: string
  onClick: () => void
  is_liked: boolean
  likes_count: number
  comments_count: number
}
export default function FeedCard({
  children,
  key,
  href,
  img,
  alt,
  author,
  created_at,
  onClick,
  is_liked,
  likes_count,
  comments_count
}: CardProps) {
  return (
    <li className="w-1/3  mt-4 grid pb-2" key={key ? key : undefined}>
      <div className="flex justify-between">
        <Link href={href} className="flex items-center justify-center mb-4">
          <img
            src={img || ' '}
            alt={alt}
            className="w-8 h-8 object-cover rounded-full mr-2"
          />
          <h2>@{author}</h2>
        </Link>
        <p className="text-gray-700">
          {new Date(created_at).toLocaleString('pt-BR')}
        </p>
      </div>
      <div className="border-b border-purple-950">{children}</div>
      <div className="flex justify-around">
        <button
          className="flex items-center justify-center gap-1 cursor-pointer"
          onClick={onClick}
        >
          {is_liked ? <AiFillLike /> : <AiOutlineLike />}
          {likes_count}
        </button>
        <button className="flex items-center justify-center gap-1">
          <MdOutlineInsertComment />
          {comments_count}
        </button>
      </div>
    </li>
  )
}
