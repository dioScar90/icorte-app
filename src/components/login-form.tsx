
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ROUTE_ENUM } from "@/types/route"
import { Link } from "react-router-dom"
import { GoogleSvg } from "./ui/google-svg"
import { LogInIcon } from "lucide-react"

export function LoginForm() {
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Digite seu email abaixo para logar com sua conta
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <Link to="/forgot-password" className="ml-auto inline-block text-sm underline">
                Forgot your password?
              </Link>
            </div>
            <Input id="password" type="password" required />
          </div>
          <Button
            type="submit" className="w-full"
            Icon={<LogInIcon />}
          >
            Login
          </Button>
          <Button
            variant="outline" className="w-full"
            Icon={<GoogleSvg />}
          >
            Login with Google
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          Ainda não tem uma conta?{' '}
          <Link to={ROUTE_ENUM.REGISTER} className="underline">
            Cadastre-se
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
