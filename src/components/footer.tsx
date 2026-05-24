import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="rounded-lg shadow mx-2 md:ml-1 py-2 mb-2 flex items-center justify-center h-[--footer-height]">
      <div className="w-full mx-auto max-w-xl px-4 text-center">
        <span className="text-center text-sm text-gray-500 dark:text-gray-400">
          © 2024 <Link to="/" className="hover:underline">iCorte™</Link>. All Rights Reserved.
        </span>
      </div>
    </footer>
  )
}
