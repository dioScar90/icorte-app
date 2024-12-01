import { ROUTE_ENUM } from "@/types/route";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer>
      <div className="footer-container">
        <span className="text-center text-sm text-gray-500 dark:text-gray-400">
          © 2024 <Link to={ROUTE_ENUM.ROOT} className="hover:underline">iCorte™</Link>. All Rights Reserved.
        </span>

        {/* <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
          <li>
            <Link to="#" className="hover:underline me-4 md:me-6">Sobre</Link>
          </li>
          <li>
            <Link to="#" className="hover:underline me-4 md:me-6">Política de privacidade</Link>
          </li>
          <li>
            <Link to="#" className="hover:underline me-4 md:me-6">Trabalhe conosco</Link>
          </li>
          <li>
            <a href="#" className="hover:underline">Contato</a>
          </li>
        </ul> */}
      </div>
    </footer>
  )
}
