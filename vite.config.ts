import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { TanStackRouterVite } from "@tanstack/router-plugin/vite"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    TanStackRouterVite({ target: 'react', autoCodeSplitting: true }),
    react()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // base: "/icorte-app/",
  // build: {
  //   rollupOptions: {
  //     output: {
  //       // Isso garante que as páginas de erro 404 sejam redirecionadas para o index.html
  //       entryFileNames: `[name].[hash].js`,
  //       chunkFileNames: `[name].[hash].js`,
  //       assetFileNames: `[name].[hash].[ext]`,
  //     },
  //   },
  // },
})
