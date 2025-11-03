export default function Home() {
  return (
    <div className="w-full h-screen flex justify-center items-center ">
      <div className="grid justify-center w-1/2 h-50 border-2 border-violet-800 text-center rounded p-4">
        <h2 className="pb-4">Login</h2>
        <input
          type="text"
          className="border-2 border-violet-600 rounded p-2 w-lg mb-2"
          placeholder="Email"
        />
        <input
          type="text"
          className="border-2 border-violet-600 rounded p-2 w-lg"
          placeholder="Senha"
        />
      </div>
    </div>
  );
}
