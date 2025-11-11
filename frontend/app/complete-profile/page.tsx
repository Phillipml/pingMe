import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function CompleteProfile(){
    return(<div>
        <h2>Complete your Profile</h2>
        <form className="grid">
            <Input placeholder="Nome"/>
            <Input placeholder="Nome"/>
            <Input placeholder="Nome"/>
            <Button>Foto perfil</Button>
            </form>
            </div>
        )
}