'use client'
import Container from '@/components/layout/Container'
import Button from '@/components/ui/Button'
import { useGetMyFollowingQuery, useGetPublicProfileQuery } from '@/lib/slice'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FaRegUserCircle } from 'react-icons/fa'

export default function UserProfile() {
  const [isFollowing, setIsFollowing] = useState(false)
  const params = useParams()
  const userId = params.id as string
  const { data } = useGetPublicProfileQuery(userId, {
    skip: !userId
  })
  const { data: followingData } = useGetMyFollowingQuery()

  useEffect(() => {
    if (data && followingData?.results) {
      const isUserFollowing = followingData.results.some(
        (user) => user.id == data.id
      )
      setIsFollowing(isUserFollowing)
    } else {
      setIsFollowing(false)
    }
  }, [data, followingData])

  return (
    <Container className="grid">
      <div className="flex w-1/3 justify-center items-center rounded-2xl shadow-2xl shadow-purple-600 m-auto p-2 mt-8">
        {data && data.info.avatar ? (
          <img
            src={data?.info.avatar || ' '}
            alt={`${data?.username} profile picture`}
            className="w-24 h-24 object-cover rounded-full mr-4"
          />
        ) : (
          <FaRegUserCircle className="w-24 h-24 object-cover rounded-full mr-4" />
        )}
        <div>
          <h2 className="border-b-2 border-purple-600 pb-2">
            Nome de usuário:
            <br /> {data?.username}
          </h2>
          <h2 className="pt-2">
            Bio: <br /> {data?.info.bio}
          </h2>
          <Button
            className="w-full"
            colorVariant={isFollowing ? 'red' : 'default'}
          >
            {isFollowing ? 'Deixar de Seguir' : 'Seguir'}
          </Button>
        </div>
      </div>
    </Container>
  )
}
