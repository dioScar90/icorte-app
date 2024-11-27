import { BarberShopLayoutContextType } from "@/components/layouts/barber-shop-layout";
import { Button } from "@/components/ui/button";
import { useLoaderData, useOutletContext } from "react-router-dom";
import { servicesLoader } from "@/data/loaders/servicesLoader";
import { getNumberAsCurrency } from "@/utils/currency";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Edit, ShoppingBag, Trash2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function BarberShopServices() {
  const { barberShop } = useOutletContext<BarberShopLayoutContextType>()
  const services = useLoaderData() as Awaited<ReturnType<typeof servicesLoader>>
  
  return (
    <>
      <div className="space-y-6">
        <div className="before-card">
          <Card className="w-full md:max-w-xl">
            <CardHeader>
              <CardTitle className="text-2xl">Serviços - {barberShop.name}</CardTitle>
              <CardDescription>
                Visualize e gerencia os serviços que aparecerão aos clientes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableCaption>Sua lista de serviços oferecidos.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[100px] text-center">Nome</TableHead>
                    <TableHead className="text-center">Descrição</TableHead>
                    <TableHead className="text-center">Preço</TableHead>
                    <TableHead className="text-center">Duração</TableHead>
                    <TableHead className="text-center">Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.isArray(services?.items) && services.items.length > 0
                    ? services.items.map(({ id, barberShopId, name, description, price, duration }) => (
                      <TableRow key={id} data-barber-shop-id={barberShopId}>
                        <TableCell className="font-medium">{name}</TableCell>
                        <TableCell className="line-clamp-2">{description}</TableCell>
                        <TableCell>{getNumberAsCurrency(price)}</TableCell>
                        <TableCell>{duration}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-between gap-x-2">
                            <Button
                              size="icon"
                              variant="outline"
                              title="Editar"
                              onClick={() => alert(JSON.stringify({ id, barberShopId, name, description, price, duration }))}
                            >
                              <Edit />
                            </Button>
                            <Button
                              size="icon"
                              variant="destructive"
                              title="Remover"
                              onClick={() => alert(JSON.stringify({ id, barberShopId, name, description, price, duration }))}
                            >
                              <Trash2 />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                    : (
                      <TableRow>
                        <TableCell colSpan={100}>
                          <Alert variant="warning">
                            <AlertDescription className="text-center my-1">
                              Nenhum serviço cadastrado
                            </AlertDescription>
                          </Alert>
                        </TableCell>
                      </TableRow>
                  )}
                </TableBody>
              </Table>

              <div className="w-full h-14 relative">
                <Button type="button" className="absolute-middle-y right-0" onClick={() => alert('Novo')}>
                  <ShoppingBag />
                  Novo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
