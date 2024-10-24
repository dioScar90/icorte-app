
export function Footer() {
  return (
    <footer>
      <div className="footer-container">
        <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
          © 2024 <a href="https://flowbite.com/" className="hover:underline">iCorte™</a>. All Rights Reserved.
        </span>

        <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
          <li>
            <a href="#" className="hover:underline me-4 md:me-6">Sobre</a>
          </li>
          <li>
            <a href="#" className="hover:underline me-4 md:me-6">Política de privacidade</a>
          </li>
          <li>
            <a href="#" className="hover:underline me-4 md:me-6">Trabalhe conosco</a>
          </li>
          <li>
            <a href="#" className="hover:underline">Contato</a>
          </li>
        </ul>
      </div>
    </footer>
  )
}
