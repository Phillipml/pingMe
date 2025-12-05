import Container from '@/components/layout/Container'
import Form from '@/components/layout/Form'
import Button from '@/components/ui/Button'

export default function Feed() {
  return (
    <Container>
      <div className="w-1/3 m-auto border-2 border-purple-600 rounded p-2">
        <Form className="border-2 border-gray-900">
          <textarea
            name=""
            id=""
            className="resize-none border-b border-gray-800 focus:outline-0"
            placeholder="Criar Ping"
          />
          <Button>Criar Ping</Button>
        </Form>
      </div>
    </Container>
  )
}
