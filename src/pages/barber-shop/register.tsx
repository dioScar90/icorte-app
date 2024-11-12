import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import { useNavigate, useOutletContext } from "react-router-dom";
import { ROUTE_ENUM } from "@/types/route";
import { barberShopSchema, BarberShopZod } from "@/schemas/barberShop";
import { StateEnum } from "@/schemas/address";
import { useHandleErrors } from "@/providers/handleErrorProvider";
import { BarberShopLayoutContextType } from "@/components/layouts/barber-shop-layout";
import { BarberShopForm } from "@/components/forms/barber-shop-form";

export function RegisterBarberShop() {
  const { register, barberShop } = useOutletContext<BarberShopLayoutContextType>()
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
        state: StateEnum.SP,
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

      navigate(`${ROUTE_ENUM.BARBER_SHOP}/${barberShop.id}/dashboard`, { state: { message: result.value?.message } })
    } catch (err) {
      handleError(err, form)
    }
  }

  return (
    <BarberShopForm form={form} onSubmit={onSubmit} />
  )
}
