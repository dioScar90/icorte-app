# iCorte

This is my personal repository about my TCC (Final Paper) project. It is a barbershop scheduling web app.
- Backend: **ASP.NET Core**, with Minimal API ([check this out here](https://github.com/dioScar90/ICorteApi)).
  - Database: **Postgres**, with Entity Framework ORM.
- Frontend: **React**, with React Router.

## Some React common steps:

### Create the React Router project:

- Creating With **Vite**:
  - `npm create vite@latest`
    - Name: _client-app_.
    - React
    - TypeScript
  - `cd client-app`
  - `npm i`

- Installing Shadcn:
  - `npm i -D tailwindcss postcss autoprefixer`
  - `npx tailwindcss init -p`

  - Add the paths to all of your template files in your _tailwind.config.js_ file.

  ```
  /** @type {import('tailwindcss').Config} */
  export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  }
  ```

  - Add the _@tailwind_ directives for each of Tailwind’s layers to your _./src/index.css_ file.

  ```
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  ```

  - The current version of Vite splits TypeScript configuration into three files, two of which need to be edited. Add the _baseUrl_ and _paths_ properties to the _compilerOptions_ section of the _tsconfig.json_ and _tsconfig.app.json_ files:

  ```
  {
    // ...
    "compilerOptions": {
      "baseUrl": ".",
      "paths": {
        "@/*": ["./src/*"]
      }
    }
    // ...
  }
  ```

  - Add the following code to the _vite.config.ts_ so your app can resolve paths without error (so you can import "path" without error)
  - `npm i -D @types/node`

  ```
  import path from "path"
  import react from "@vitejs/plugin-react"
  import { defineConfig } from "vite"
  
  export default defineConfig({
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  })
  ```

  - `npx shadcn@latest init`
    - Style: New York.
    - Base color: Zinc.
    - CSS variables: yes.

  - That's it! Now install your common components:
    - `npx shadcn@latest add toast`
    - `npx shadcn@latest add input`
    - `npx shadcn@latest add form` (this includes also _button_ and _label_)
    - `npx shadcn@latest add dropdown-menu`
    - `npx shadcn@latest add dialog`
    - `npx shadcn@latest add card`
    - `npx shadcn@latest add table`

- Other useful libs to add:
  - `npm i react-router-dom`
  - `npm i axios`
  - `npm i @tanstack/react-query`
    - `npm i -D @tanstack/eslint-plugin-query` (recommended)
  - `npm i react-hook-form @hookform/resolvers zod`
  - `npm i sweetalert2`
  - `npm i lucide-react`