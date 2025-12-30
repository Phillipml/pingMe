'use client'
import Container from '@/components/layout/Container'
import Form from '@/components/layout/Form'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import {
  useDeleteUserMutation,
  useGetMyFollowersQuery,
  useGetMyFollowingQuery,
  useGetProfileQuery,
  useUpdateProfileMutation
} from '@/lib/slice'
import { getMediaUrl, isExternalUrl } from '@/utils/api-utils'
import { useState } from 'react'
import Image from 'next/image'
import { TbPhotoEdit } from 'react-icons/tb'
import CenterContainer from '@/components/layout/CenterContainer'
import { AiOutlineLoading } from 'react-icons/ai'
import UserPostsList from '@/components/layout/UserPostsList'
import { useRouter } from 'next/navigation'
import { IoMdCloseCircleOutline } from 'react-icons/io'
import { FollowingResponse } from '@/utils/api-interfaces'
import Link from 'next/link'
import Modal from '@/components/layout/Modal'

export default function Profile() {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [error, setError] = useState('')
  const [username, setUsername] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [bio, setBio] = useState('')
  const [avatar, setAvatar] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const { data, isLoading, refetch } = useGetProfileQuery()
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation()
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation()
  const { data: followers } = useGetMyFollowersQuery()
  const { data: following } = useGetMyFollowingQuery()

  const [showModal, setShowModal] = useState(false)
  const [modalContent, setModalContent] = useState<FollowingResponse | null>(
    null
  )
  const handleModal = (data: FollowingResponse) => {
    setShowModal(true)
    setModalContent(data)
  }
  const handleStartEdit = () => {
    if (data) {
      setUsername(data.username || '')
      setFirstName(data.info?.first_name || '')
      setLastName(data.info?.last_name || '')
      setBio(data.info?.bio || '')
      setAvatarPreview(getMediaUrl(data.info?.avatar))
    }
    setIsEditing(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const formData = new FormData()
      if (username) formData.append('username', username)
      if (firstName) formData.append('first_name', firstName)
      if (lastName) formData.append('last_name', lastName)
      if (bio) formData.append('bio', bio)
      if (avatar) formData.append('avatar', avatar)

      await updateProfile(formData).unwrap()
      await refetch()
      setIsEditing(false)
      setAvatar(null)
      setAvatarPreview(null)
    } catch (err: unknown) {
      const error = err as { data?: { error?: string; message?: string } }
      setError(
        error?.data?.error || error.data?.message || 'Erro ao atualizar perfil'
      )
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setError('')
    setAvatar(null)
    setAvatarPreview(null)
    if (data) {
      setUsername(data.username || '')
      setFirstName(data.info.first_name || '')
      setLastName(data.info.last_name || '')
      setBio(data.info.bio || '')
      setAvatarPreview(getMediaUrl(data.info.avatar))
    }
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setAvatar(file)

    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setAvatarPreview(data ? getMediaUrl(data.info.avatar) : null)
    }
  }
  const handleDeleteUser = async () => {
    const confirmed = window.confirm(
      'Tem certeza que deseja deletar sua conta? Esta ação não pode ser desfeita!'
    )

    if (confirmed) {
      try {
        await deleteUser().unwrap()
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken')
          router.push('/login')
        }
      } catch (error) {
        const err = error as { data?: { error?: string; message?: string } }
        setError(
          err?.data?.error || err?.data?.message || 'Erro ao deletar conta'
        )
      }
    }
  }

  if (isLoading) {
    return (
      <CenterContainer>
        <AiOutlineLoading className="animate-spin m-auto text-4xl" />
      </CenterContainer>
    )
  }

  return (
    <>
      <Container className="max-w-6xl mx-auto pb-8 flex flex-col lg:flex-row justify-around p-2 gap-8">
        <div className="flex flex-col items-center gap-6 p-4 w-full lg:w-auto">
          <div className="relative">
            <Image
              src={avatarPreview || getMediaUrl(data?.info.avatar)}
              alt="Avatar"
              width={128}
              height={128}
              className="rounded-full w-24 h-24 sm:w-32 sm:h-32 object-cover border-4 border-violet-600"
              unoptimized={isExternalUrl(
                avatarPreview || getMediaUrl(data?.info.avatar)
              )}
            />
            {isEditing && (
              <label className="absolute bottom-0 right-0 bg-violet-600 rounded-full p-2 cursor-pointer hover:bg-violet-700 transition">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                <TbPhotoEdit className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </label>
            )}
          </div>

          {!isEditing ? (
            <div className="w-full text-center space-y-4 pb-8">
              <div>
                <span className="text-gray-400 text-xs sm:text-sm">
                  Username:
                </span>
                <h2 className="text-xl sm:text-2xl font-bold wrap-break-word">
                  {data?.username}
                </h2>
              </div>

              {data?.info.first_name && (
                <div>
                  <span className="text-gray-400 text-xs sm:text-sm">
                    Nome:
                  </span>
                  <p className="text-base sm:text-lg wrap-break-word">
                    {data.info.first_name}
                  </p>
                </div>
              )}

              {data?.info.last_name && (
                <div>
                  <span className="text-gray-400 text-xs sm:text-sm">
                    Sobrenome:
                  </span>
                  <p className="text-base sm:text-lg wrap-break-word">
                    {data.info.last_name}
                  </p>
                </div>
              )}

              {data?.info.bio && (
                <div>
                  <span className="text-gray-400 text-xs sm:text-sm">Bio:</span>
                  <p className="text-base sm:text-lg wrap-break-word px-4">
                    {data.info.bio}
                  </p>
                </div>
              )}
              <div className="flex w-full justify-center items-center gap-4">
                <Button
                  onClick={handleStartEdit}
                  className="mt-6 sm:w-auto sm:max-w-md"
                >
                  Editar Perfil
                </Button>
                <Button
                  onClick={handleDeleteUser}
                  className="mt-6 sm:w-auto sm:max-w-md"
                  colorVariant="red"
                >
                  {isDeleting ? (
                    <AiOutlineLoading className="animate-spin m-auto text-4xl" />
                  ) : (
                    'Deletar Perfil'
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <Form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
              {error && (
                <div className="text-red-500 text-sm mb-4 text-center">
                  {error}
                </div>
              )}

              <div className="mb-4">
                <label className="block text-xs sm:text-sm text-gray-400 mb-1 text-center">
                  Username
                </label>
                <Input
                  placeholder="Digite seu username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full text-center text-sm sm:text-base"
                />
              </div>

              <div className="mb-4">
                <label className="block text-xs sm:text-sm text-gray-400 mb-1 text-center">
                  Nome
                </label>
                <Input
                  placeholder="Digite seu nome"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full text-center text-sm sm:text-base"
                />
              </div>

              <div className="mb-4">
                <label className="block text-xs sm:text-sm text-gray-400 mb-1 text-center">
                  Sobrenome
                </label>
                <Input
                  placeholder="Digite seu sobrenome"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full text-center text-sm sm:text-base"
                />
              </div>

              <div className="mb-4">
                <label className="block text-xs sm:text-sm text-gray-400 mb-1 text-center">
                  Bio
                </label>
                <Input
                  placeholder="Digite sua bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full text-center text-sm sm:text-base"
                />
              </div>

              <div className="mb-4">
                <label className="block text-xs sm:text-sm text-gray-400 mb-1 text-center">
                  Alterar Avatar
                </label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="cursor-pointer w-full text-xs sm:text-sm"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2 mt-6">
                <Button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-sm sm:text-base"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isUpdating}
                  className="flex-1 text-sm sm:text-base"
                  loading={isUpdating}
                >
                  Salvar
                </Button>
              </div>
            </Form>
          )}
        </div>
        <div className="w-full lg:w-1/2">
          <div className="flex justify-center items-center gap-4 p-4 mb-4 border-b">
            <Button onClick={() => following && handleModal(following)}>
              {following?.count} seguindo
            </Button>
            <Button onClick={() => followers && handleModal(followers)}>
              {followers?.count} seguidores
            </Button>
          </div>

          <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
            {modalContent?.count === 0 ? (
              <p>Nenhum usuário</p>
            ) : (
              modalContent &&
              modalContent.results.map((follower, i) => (
                <Link
                  key={follower.id}
                  href={`user-profile/${follower.id}`}
                  className={`${i % 2 === 0 ? 'bg-gray-950' : ''} flex gap-4 w-full p-4`}
                >
                  <Image
                    src={follower?.avatar ?? ''}
                    alt={follower.username}
                    width={48}
                    height={48}
                    className="rounded-full max-h-12 object-cover"
                    unoptimized
                  />
                  <p>{follower.username}</p>
                </Link>
              ))
            )}
          </Modal>

          <UserPostsList
            userId={data?.id}
            showDelete={true}
            onPostDelete={refetch}
            className="w-full"
          />
        </div>
      </Container>
    </>
  )
}
