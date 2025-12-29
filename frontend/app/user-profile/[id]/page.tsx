'use client'
import Container from '@/components/layout/Container'
import UserPostsList from '@/components/layout/UserPostsList'
import Button from '@/components/ui/Button'
import {
  useFollowMutation,
  useGetMyFollowingQuery,
  useGetPublicProfileQuery,
  useUnfollowMutation
} from '@/lib/slice'
import { useParams } from 'next/navigation'
import { useMemo, useState } from 'react'
import Image from 'next/image'
import { isExternalUrl } from '@/utils/api-utils'
import { FaRegUserCircle } from 'react-icons/fa'

export default function UserProfile() {
  const params = useParams()
  const userId = params.id as string
  const { data } = useGetPublicProfileQuery(userId, {
    skip: !userId
  })
  const { data: followingData } = useGetMyFollowingQuery()
  const [follow, { isLoading: followLoading }] = useFollowMutation()
  const [unfollow, { isLoading: unfollowLoading }] = useUnfollowMutation()

  const isFollowingComputed = useMemo(() => {
    if (!data || !followingData?.results) {
      return false
    }
    return followingData.results.some((user) => user.id == data.id)
  }, [data, followingData])

  const [isFollowingState, setIsFollowingState] = useState(isFollowingComputed)

  const followHandle = async () => {
    if (!data?.id) return
    try {
      if (isFollowingState) {
        await unfollow({ following: data?.id })
        setIsFollowingState(false)
      } else {
        await follow({ following: data?.id })
        setIsFollowingState(true)
      }
    } catch {
      alert('Erro ao fazer requisição')
    }
  }
  const buttonContent = () => {
    if (isFollowingState) {
      return 'Deixar de seguir'
    }
    return 'Seguir'
  }

  return (
    <Container className="flex flex-col lg:flex-row gap-8">
      <div className="flex flex-col sm:flex-row w-full lg:w-1/3 justify-center items-center rounded-2xl shadow-2xl shadow-purple-600 m-auto p-4 sm:p-6 mt-8 gap-4 sm:gap-6">
        {data && data.info.avatar ? (
          <Image
            src={data?.info.avatar || ' '}
            alt={`${data?.username} profile picture`}
            width={96}
            height={96}
            className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-full shrink-0"
            unoptimized={isExternalUrl(data?.info.avatar || ' ')}
          />
        ) : (
          <FaRegUserCircle className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-full shrink-0" />
        )}
        <div className="w-full sm:w-auto text-center sm:text-left">
          <h2 className="border-b-2 border-purple-600 pb-2 text-sm sm:text-base mb-2">
            Nome de usuário:
            <br />
            <span className="font-bold text-base sm:text-lg">
              {data?.username}
            </span>
          </h2>
          {data?.info.bio && (
            <h2 className="pt-2 text-sm sm:text-base mb-4">
              Bio: <br />
              <span className="wrap-break-word">{data?.info.bio}</span>
            </h2>
          )}
          <Button
            className="w-full sm:w-auto"
            colorVariant={isFollowingState ? 'red' : 'default'}
            onClick={followHandle}
            loading={followLoading || unfollowLoading}
          >
            {buttonContent()}
          </Button>
        </div>
      </div>
      <div className="w-full lg:w-1/2 m-auto">
        <UserPostsList
          userId={userId}
          showDelete={false}
          title={`Pings de ${data?.username}`}
          onPostDelete={() => {}}
          className="mt-8 lg:mt-14"
        />
      </div>
    </Container>
  )
}
