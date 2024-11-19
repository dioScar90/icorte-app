import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import { useNavigate, useOutletContext } from "react-router-dom";
import { ROUTE_ENUM } from "@/types/route";
import { barberShopSchema, BarberShopZod } from "@/schemas/barberShop";
import { useHandleErrors } from "@/providers/handleErrorProvider";
import { BarberShopLayoutContextType } from "@/components/layouts/barber-shop-layout";
import { BarberShopForm } from "@/components/forms/barber-shop-form";
import { useEffect } from "react";
import { applyMask, MaskTypeEnum } from "@/utils/mask";

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
        state: undefined,
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

  const comercialNumber = form.watch('comercialNumber')
  const postalCode = form.watch('address.postalCode')
  
  useEffect(() => {
    form.setValue('comercialNumber', applyMask(MaskTypeEnum.PHONE_NUMBER, comercialNumber))
  }, [comercialNumber])

  useEffect(() => {
    form.setValue('address.postalCode', applyMask(MaskTypeEnum.CEP, postalCode))
  }, [postalCode])

  return (
    <BarberShopForm form={form} onSubmit={onSubmit} />
  )
}
