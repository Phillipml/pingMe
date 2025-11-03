import { Logo } from "./components/ui/Logo";
export default function Home() {
  return (
    <div className="w-full h-screen flex justify-center items-center ">
      <div className="grid w-lg justify-center border-2 border-violet-800 text-center rounded p-4">
        <Logo className="text-2xl m-auto border-b-2 border-violet-600 pb-2 mb-8 mt-2" />
        <h2 className="mb-8">Login</h2>
        <input
          type="text"
          className="border-2 border-violet-600 rounded p-2 mb-2 w-100"
          placeholder="Email"
        />
        <input
          type="text"
          className="border-2 border-violet-600 rounded p-2 w-100"
          placeholder="Senha"
        />
        <button className="p-4 rounded text-center bg-violet-800 hover:bg-violet-600 cursor-pointer mt-4 mb-4 transition">
          Entrar
        </button>
      </div>
    </div>
  );
}
