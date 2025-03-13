import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer>
      <div className="footer-container">
        <span className="text-center text-sm text-gray-500 dark:text-gray-400">
          © 2024 <Link to="/" className="hover:underline">iCorte™</Link>. All Rights Reserved.
        </span>
      </div>
    </footer>
  )
}
