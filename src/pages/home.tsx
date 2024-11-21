import { buttonVariants } from "@/components/ui/button";
import { ROUTE_ENUM } from "@/types/route";
import { Link } from "react-router-dom";

export function Home() {
  return (
    <>
      <p className="mb-3">
        Hello! This is your barber shop online.
      </p>

      <Link to={ROUTE_ENUM.LOGIN} className={buttonVariants({ variant: "secondary" })}>
        Login
      </Link>
    </>
  )
}
