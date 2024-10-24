import { ROUTE_ENUM } from "@/types/route";
import { Link } from "react-router-dom";

export function Home() {
  return (
    <>
      <p>Hello! This is my Home Page.</p>
      <Link to={ROUTE_ENUM.LOGIN}>Login</Link>
    </>
  )
}
