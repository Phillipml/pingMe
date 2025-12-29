'use client'
import Link from 'next/link'
import { User, BaseUser } from '@/utils/api-interfaces'
import { getMediaUrl } from '@/utils/api-utils'
import defaulUserAvatar from '@/public/user.png'

interface UserProfileLinkProps {
  user: User | BaseUser
  href?: string
  className?: string
  avatarClassName?: string
  usernameClassName?: string
  showUsername?: boolean
}

export const UserProfileLink = ({
  user,
  href = '/profile',
  className = '',
  avatarClassName = 'rounded-full w-12 h-12 object-cover m-auto',
  usernameClassName = 'pl-2 pr-2 truncate',
  showUsername = true
}: UserProfileLinkProps) => {
  const avatar = 'info' in user ? user.info.avatar : user.avatar
  const username = user.username

  const avatarSrc =
    avatar && typeof avatar === 'string'
      ? getMediaUrl(avatar)
      : typeof defaulUserAvatar === 'string'
        ? defaulUserAvatar
        : (defaulUserAvatar as any).src

  return (
    <Link href={href} className={className}>
      <div>
        <img src={avatarSrc} className={avatarClassName} alt={username} />
        {showUsername && <h2 className={usernameClassName}>{username}</h2>}
      </div>
    </Link>
  )
}
