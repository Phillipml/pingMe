'use client'
import Container from '@/components/layout/Container'
import Form from '@/components/layout/Form'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import {
  useDeletePostMutation,
  useGetProfileQuery,
  useGetUserPostQuery,
  useUpdateProfileMutation
} from '@/lib/slice'
import { getMediaUrl } from '@/utils/api-utils'
import { useState, useEffect } from 'react'
import { TbPhotoEdit } from 'react-icons/tb'
import UserPostCard from '@/components/layout/Card/UserPostCard'
import CenterContainer from '@/components/layout/CenterContainer'
import { AiOutlineLoading } from 'react-icons/ai'
import UserPostsList from '@/components/layout/UserPostsList'

export default function Profile() {
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
  const [deletePost] = useDeletePostMutation()
  const deletePostById = async (id: number) => {
    if (!id) {
      alert('ID do post inválido')
      return
    }
    try {
      await deletePost(id).unwrap()
      alert('Post deletado com sucesso')
      refetch()
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || error?.data?.error || 'Erro ao deletar post'
      alert(errorMessage)
    } finally {
    }
  }

  useEffect(() => {
    if (data) {
      if (isEditing) {
        setUsername(data.username || '')
        setFirstName(data.info?.first_name || '')
        setLastName(data.info?.last_name || '')
        setBio(data.info?.bio || '')
        setAvatarPreview(getMediaUrl(data.info?.avatar))
      } else {
        setUsername('')
        setFirstName('')
        setLastName('')
        setBio('')
        setAvatar(null)
        setAvatarPreview(null)
      }
    }
  }, [data, isEditing])
  useEffect(() => {}, [data?.id])

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

  if (isLoading) {
    return (
      <CenterContainer>
        <AiOutlineLoading className="animate-spin m-auto text-4xl" />
      </CenterContainer>
    )
  }

  return (
    <>
      <Container className="max-w-2xl mx-auto pb-8 flex justify-around p-2">
        <div className="flex flex-col items-center gap-6 p-4">
          <div className="relative">
            <img
              src={avatarPreview || getMediaUrl(data?.info.avatar)}
              alt="Avatar"
              className="rounded-full w-32 h-32 object-cover border-4 border-violet-600"
            />
            {isEditing && (
              <label className="absolute bottom-0 right-0 bg-violet-600 rounded-full p-2 cursor-pointer hover:bg-violet-700 transition">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                <TbPhotoEdit className="w-5 h-5 text-white" />
              </label>
            )}
          </div>

          {!isEditing ? (
            <div className="w-full text-center space-y-4 pb-8">
              <div>
                <span className="text-gray-400 text-sm">Username:</span>
                <h2 className="text-2xl font-bold">{data?.username}</h2>
              </div>

              {data?.info.first_name && (
                <div>
                  <span className="text-gray-400 text-sm">Nome:</span>
                  <p className="text-lg">{data.info.first_name}</p>
                </div>
              )}

              {data?.info.last_name && (
                <div>
                  <span className="text-gray-400 text-sm">Sobrenome:</span>
                  <p className="text-lg">{data.info.last_name}</p>
                </div>
              )}

              {data?.info.bio && (
                <div>
                  <span className="text-gray-400 text-sm">Bio:</span>
                  <p className="text-lg">{data.info.bio}</p>
                </div>
              )}

              <Button
                onClick={() => {
                  if (data) {
                    setUsername(data.username || '')
                    setFirstName(data.info?.first_name || '')
                    setLastName(data.info?.last_name || '')
                    setBio(data.info?.bio || '')
                    setAvatarPreview(getMediaUrl(data.info?.avatar))
                  }
                  setIsEditing(true)
                }}
                className="mt-6 w-full max-w-md"
              >
                Editar Perfil
              </Button>
            </div>
          ) : (
            <Form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
              {error && (
                <div className="text-red-500 text-sm mb-4 text-center">
                  {error}
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-1 text-center">
                  Username
                </label>
                <Input
                  placeholder="Digite seu username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full text-center"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-1 text-center">
                  Nome
                </label>
                <Input
                  placeholder="Digite seu nome"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full text-center"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-1 text-center">
                  Sobrenome
                </label>
                <Input
                  placeholder="Digite seu sobrenome"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full text-center"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-1 text-center">
                  Bio
                </label>
                <Input
                  placeholder="Digite sua bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full text-center"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-1 text-center">
                  Alterar Avatar
                </label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="cursor-pointer w-full"
                />
              </div>

              <div className="flex gap-2 mt-6">
                <Button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 bg-gray-600 hover:bg-gray-700"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isUpdating}
                  className="flex-1"
                  loading={isUpdating}
                >
                  Salvar
                </Button>
              </div>
            </Form>
          )}
        </div>
        <UserPostsList
          userId={data?.id}
          showDelete={true}
          onPostDelete={refetch}
          className="w-1/2"
        />
      </Container>
    </>
  )
}
