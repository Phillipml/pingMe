import CenterContainer from "@/components/layout/CenterContainer";
import Form from "@/components/layout/Form";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Logo } from "@/components/ui/Logo";

export default function CompleteProfile(){
    return(<CenterContainer>
        
        <h2 className="text-center">Complete your Profile</h2>
        <Logo className="text-2xl border-b-2 border-violet-600 pb-2 mb-8 mt-2" />
        <Form>
        <Input placeholder="Username"/>
            <Input placeholder="Nome"/>
            <Input placeholder="Sobrenome" />
            <Input placeholder="Bio" />
            <Button>Foto perfil</Button>
            </Form>
         </CenterContainer>
        )
}