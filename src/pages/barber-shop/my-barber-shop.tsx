import { BarberShopLayoutContextType } from "@/components/layouts/barber-shop-layout";
import { Button } from "@/components/ui/button";
import { ROUTE_ENUM } from "@/types/route";
import { Link, useOutletContext } from "react-router-dom";

export function MyBarberShop() {
  const { barberShop } = useOutletContext<BarberShopLayoutContextType>()
  
  return (
    <>
      <h3>{barberShop.name}</h3>
      {barberShop.description && <p>{barberShop.description}</p>}

      <pre>{JSON.stringify(barberShop, undefined, 2)}</pre>
      <Button variant="link" asChild>
        <Link to={`${ROUTE_ENUM.BARBER_SHOP}/${barberShop.id}/edit`}>Editar minha barbearia</Link>
      </Button>
    </>
  )
}
