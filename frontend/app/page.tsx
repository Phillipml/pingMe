import Container from "@/components/layout/Container";
import { Logo } from "../components/ui/Logo";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
export default function Home() {
  return (
    <Container>
      <div className="flex flex-col justify-center items-center fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 w-full lg:w-1/2">
        <Logo className="text-2xl m-auto border-b-2 border-violet-600 pb-2 mb-8 mt-2" />
        <h2 className="mb-8 text-center">Login</h2>
        <Input
          type="text"
          className="w-5/6 text-center lg:w-1/2"
          placeholder="Email"
        />
        <Input
          type="password"
          className="w-5/6 text-center lg:w-1/2"
          placeholder="Senha"
        />
        <Button className="w-5/6 lg:w-1/2">Entrar</Button>
      </div>
    </Container>
  );
}
