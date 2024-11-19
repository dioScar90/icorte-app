import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import { useNavigate, useOutletContext } from "react-router-dom";
import { ROUTE_ENUM } from "@/types/route";
import { useHandleErrors } from "@/providers/handleErrorProvider";
import { useCallback, useEffect } from "react";
import { BarberShopLayoutContextType } from "@/components/layouts/barber-shop-layout";
import { barberShopSchema, BarberShopZod } from "@/schemas/barberShop";
import { BarberShopForm } from "@/components/forms/barber-shop-form";
import { applyMask, MaskTypeEnum } from "@/utils/mask";

export function BarberShopEdit() {
  const { update, barberShop } = useOutletContext<BarberShopLayoutContextType>()
  const navigate = useNavigate()
  const { handleError } = useHandleErrors()
  console.log('barberShop', {barberShop})
  const form = useForm<BarberShopZod>({
    resolver: zodResolver(barberShopSchema),
    defaultValues: {
      name: barberShop.name,
      description: barberShop.description,
      comercialNumber: barberShop.comercialNumber,
      comercialEmail: applyMask(MaskTypeEnum.PHONE_NUMBER, barberShop.comercialEmail),
      address: {
        street: barberShop.address.street,
        number: barberShop.address.number,
        complement: barberShop.address.complement,
        neighborhood: barberShop.address.neighborhood,
        city: barberShop.address.city,
        state: barberShop.address.state,
        postalCode: applyMask(MaskTypeEnum.CEP, barberShop.address.postalCode),
        country: barberShop.address.country,
      }
    }
  })
  
  const onSubmit = useCallback(async function(values: BarberShopZod) {
    try {
      const result = await update(barberShop.id, values)

      if (!result.isSuccess) {
        throw result.error
      }
      
      const url = `${ROUTE_ENUM.BARBER_SHOP}/${barberShop.id}`
      const message = 'Barbearia alterada com sucesso'
      navigate(url, { state: { message } })
    } catch (err) {
      handleError(err, form)
    }
  }, [])
  
  const comercialNumber = form.watch('comercialNumber')
  const postalCode = form.watch('address.postalCode')
  
  useEffect(() => {
    form.setValue('comercialNumber', applyMask(MaskTypeEnum.PHONE_NUMBER, comercialNumber))
  }, [comercialNumber])
  
  useEffect(() => {
    form.setValue('address.postalCode', applyMask(MaskTypeEnum.CEP, postalCode))
  }, [postalCode])
  
  return (
    <>
      <h3>{barberShop.name}</h3>
      <BarberShopForm form={form} isUpdate onSubmit={onSubmit} />
    </>
  )
}
