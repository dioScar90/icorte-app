import { JsonDebugger } from "@/components/json-debugger"
import { myAppointmentLoader } from "@/data/loaders/myAppointmentLoader"
import { useLoaderData } from "react-router-dom"

export function AppointmentPage() {
  const appointment = useLoaderData() as Awaited<ReturnType<typeof myAppointmentLoader>>
  
  return (
    <>
      <p>Meu agendamento</p>
      <JsonDebugger obj={appointment!} />
    </>
  )
}
