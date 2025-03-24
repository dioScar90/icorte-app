import { buttonVariants } from "@/components/ui/button"; // Shadcn Button
import errouImgUrl from "/errou.webp";
import { Home as HomeIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";

export function ErrorRoutePage() {
  return (
    <div className="flex flex-col gap-y-4 items-center justify-start h-screen text-center p-4">
      <h1 className="text-4xl font-bold">Erroooou...</h1>

      <p className="text-lg">
        Essa página ainda não existe, assim como as chances de acertar essa rota! 😅
      </p>

      <img
        src={errouImgUrl}
        alt="Erroooou"
        className="shadow-lg mb-6"
      />
      
      <Link to="/" className={cn(buttonVariants({ variant: 'default' }))}>
        <HomeIcon />
        Voltar para home
      </Link>
    </div>
  )
}
