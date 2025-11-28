import Container from '@/components/layout/Container'
import Header from '@/components/layout/Header'
import { useGetProfileQuery } from '@/lib/slice'
import { getMediaUrl } from '@/utils/api-utils'

export default function Profile() {
  const { data, isLoading } = useGetProfileQuery()
  return (
    <>
      <Header />
      <Container>
        <img
          src={getMediaUrl(`${data?.info.avatar}`)}
          className="rounded-full w-12 h-12 object-cover"
        />
      </Container>
    </>
  )
}
