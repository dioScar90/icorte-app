import { BarberShopLayoutContextType } from "@/components/layouts/barber-shop-layout";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button, buttonVariants } from "@/components/ui/button";
import { StateEnum } from "@/schemas/address";
import { ROUTE_ENUM } from "@/types/route";
import { getEnumAsString } from "@/utils/enum-as-array";
import { applyMask, MaskTypeEnum } from "@/utils/mask";
import { useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { JsonDebugger } from "@/components/json-debugger";

export function MyBarberShop() {
  const { barberShop } = useOutletContext<BarberShopLayoutContextType>()
  const [showPre, setShowPre] = useState(false)

  return (
    <>
      <h3>{barberShop.name}</h3>
      {barberShop.description && <p>{barberShop.description}</p>}

      <div className="max-w-3xl mx-auto p-6 rounded-lg shadow-lg">
        <AspectRatio ratio={6} className="relative rounded-lg overflow-hidden">
          <img
            src={barberShop.imageUrl}
            alt={barberShop.name}
            className="w-full h-full object-cover"
          />
        </AspectRatio>

        <div className="mt-6 flex items-center space-x-4">
          <div className="text-xl font-semibold">{barberShop.name}</div>
        </div>

        {barberShop.description && (
          <p className="mt-1 text-gray-600">{barberShop.description}</p>
        )}

        <div className="mt-6">
          <h3 className="text-lg font-medium">Informações de Contato</h3>
          <div className="space-y-4 mt-4">
            <div className="flex justify-between">
              <span className="font-semibold">Número Comercial</span>
              <span className="text-gray-600">{applyMask(MaskTypeEnum.PHONE_NUMBER, barberShop.comercialNumber)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">E-mail Comercial</span>
              <span className="text-gray-600">{barberShop.comercialEmail}</span>
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        <div>
          <h3 className="text-lg font-medium">Endereço</h3>
          <div className="space-y-4 mt-4">
            <div className="flex justify-between">
              <span className="font-semibold">Endereço</span>
              <span className="text-gray-600">
                {barberShop.address.street}, {barberShop.address.number}
              </span>
            </div>
            {barberShop.address.complement && (
              <div className="flex justify-between">
                <span className="font-semibold">Complemento</span>
                <span className="text-gray-600">{barberShop.address.complement}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="font-semibold">Bairro</span>
              <span className="text-gray-600">{barberShop.address.neighborhood}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Cidade</span>
              <span className="text-gray-600">{barberShop.address.city}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Estado</span>
              <span className="text-gray-600">{getEnumAsString(StateEnum, barberShop.address.state)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">CEP</span>
              <span className="text-gray-600">{applyMask(MaskTypeEnum.CEP, barberShop.address.postalCode)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">País</span>
              <span className="text-gray-600">{barberShop.address.country}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center align-center gap-x-3">
        <Button variant="secondary" onClick={() => setShowPre(prev => !prev)}>
          Toggle JSON
        </Button>

        <Link to={`${ROUTE_ENUM.BARBER_SHOP}/${barberShop.id}/edit`} className={buttonVariants({ variant: "link" })}>
          Editar minha barbearia
        </Link>
      </div>

      {showPre && <JsonDebugger obj={barberShop} />}
    </>
  )
}
