import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import { useNavigate, useOutletContext } from "react-router-dom";
import { ROUTE_ENUM } from "@/types/route";
import { barberShopSchema, BarberShopZod } from "@/schemas/barberShop";
import { useHandleErrors } from "@/providers/handleErrorProvider";
import { BarberShopLayoutContextType } from "@/components/layouts/barber-shop-layout";
import { BarberShopForm } from "@/components/forms/barber-shop-form";

export function RegisterBarberShop() {
  const { register } = useOutletContext<BarberShopLayoutContextType>()
  const navigate = useNavigate()
  const { handleError } = useHandleErrors()
  
  const form = useForm<BarberShopZod>({
    resolver: zodResolver(barberShopSchema),
    defaultValues: {
      name: '',
      description: '',
      comercialNumber: '',
      comercialEmail: '',
      address: {
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        // state: '',
        postalCode: '',
        country: 'Brasil',
      }
    }
  })

  async function onSubmit(values: BarberShopZod) {
    try {
      const result = await register(values)
      
      if (!result.isSuccess) {
        throw result.error
      }
      
      const url = `${ROUTE_ENUM.BARBER_SHOP}/${result.value.item.id}/dashboard`
      const message = result.value?.message
      navigate(url, { state: { message } })
    } catch (err) {
      handleError(err, form)
    }
  }

  return (
    <BarberShopForm form={form} onSubmit={onSubmit} />
  )
}
