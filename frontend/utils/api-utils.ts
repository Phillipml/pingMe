import DefaultAvatar from '../public/user.png'
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
export const BACKEND_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'

export function getMediaUrl(path: string | null | undefined): string {
  if (!path) return `${DefaultAvatar}`
  if (path.startsWith('http')) return path
  return `${BACKEND_BASE_URL}${path}`
}
