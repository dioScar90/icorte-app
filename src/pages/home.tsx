import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/authProvider";
import { ROUTE_ENUM } from "@/types/route";
import { CalendarCheck2, CalendarIcon, LogInIcon, ScissorsIcon, StoreIcon, UserIcon, UserRoundPlusIcon } from "lucide-react";
import { Link } from "react-router-dom";

export function Home() {
  const { isAuthenticated, isBarberShop, user } = useAuth()

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-8 px-4 py-10 md:px-20 lg:px-40">
        <section className="text-center">
          <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
            Bem-vindo ao <span className="text-primary">iCorte</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground sm:text-xl">
            Simplifique sua rotina com o sistema de agendamento mais fácil e
            prático para barbearias.
          </p>
        </section>
        
        <section className="flex flex-col items-center gap-6 md:flex-row md:gap-8">
          {isAuthenticated ? (
            isBarberShop ? (
              <>
                <Link
                  className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'w-full md:w-auto')}
                  to={`${ROUTE_ENUM.BARBER_SHOP}/${user?.barberShop?.id}/dashboard`}
                >
                  <StoreIcon className="mr-2 h-5 w-5" />
                  Minha barbearia
                </Link>
              </>
            ) : (
              <>
                <Link
                  className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'w-full md:w-auto')}
                  to={`${ROUTE_ENUM.BARBER_SHOP}/register`}
                >
                  <StoreIcon className="mr-2 h-5 w-5" />
                  Cadastrar Barbearia
                </Link>
                <Link
                  className={cn(buttonVariants({ size: 'lg' }), 'w-full md:w-auto')}
                  to={`${ROUTE_ENUM.BARBER_SHOP}/schedule`}
                >
                  <ScissorsIcon className="mr-2 h-5 w-5" />
                  Marcar um corte
                </Link>
              </>
            )
          ) : (
            <>
              <Link
                to={ROUTE_ENUM.LOGIN}
                className={cn(buttonVariants({ variant: 'secondary', size: 'lg' }), 'w-full md:w-auto')}
              >
                <LogInIcon className="mr-2 h-5 w-5" />
                Login
              </Link>
              <Link
                to={ROUTE_ENUM.REGISTER}
                className={cn(buttonVariants({ size: 'lg' }), 'w-full md:w-auto')}
              >
                <UserRoundPlusIcon className="mr-2 h-5 w-5" />
                Cadastre-se
              </Link>
            </>
          )}
        </section>

        <section className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border bg-background p-6 text-center shadow-sm">
            <UserIcon className="mx-auto mb-4 h-10 w-10 text-primary" />
            <h3 className="text-xl font-bold">Clientes Felizes</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Faça seu agendamento em segundos e aproveite um atendimento
              personalizado.
            </p>
          </div>
          <div className="rounded-lg border bg-background p-6 text-center shadow-sm">
            <CalendarIcon className="mx-auto mb-4 h-10 w-10 text-primary" />
            <h3 className="text-xl font-bold">Agenda Organizada</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Gerencie seus horários com facilidade, sem complicações.
            </p>
          </div>
          <div className="rounded-lg border bg-background p-6 text-center shadow-sm">
            <ScissorsIcon className="mx-auto mb-4 h-10 w-10 text-primary" />
            <h3 className="text-xl font-bold">Barbeiros Preparados</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Profissionais qualificados prontos para atender você com estilo.
            </p>
          </div>
        </section>
      </div>
    </>
  )
}
