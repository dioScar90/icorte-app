import { buttonVariants } from "@/components/ui/button"; // Shadcn Button
import { Link } from "react-router-dom";
import errouImgUrl from "/errou.webp";
import { ROUTE_ENUM } from "@/types/route";
import { Home } from "lucide-react";
import { cn } from "@/lib/utils";

export function ErrorRoutePage() {
  return (
    <div className="flex flex-col gap-y-4 items-center justify-start h-screen text-center p-4">
      <h1 className="text-4xl font-bold">Erroooou...</h1>
      <p className="text-lg">
        Essa página não existe, assim como as chances de acertar essa rota! 😅
      </p>
      <img
        src={errouImgUrl}
        alt="Erroooou"
        className="shadow-lg mb-6"
      />
      
      <Link to={ROUTE_ENUM.HOME} className={cn(buttonVariants({ variant: 'default' }))}>
        <Home />
        Voltar para home
      </Link>
    </div>
  );
}
