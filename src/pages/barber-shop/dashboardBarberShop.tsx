import { useBarberShop } from "@/providers/barberShopProvider";

export function BarberShopDashboard() {
  const { barberShop } = useBarberShop()
  
  return (
    <>
      <h3>Dashboard - barbearia</h3>
      <pre>{JSON.stringify(barberShop, undefined, 2)}</pre>
    </>
  )
}
