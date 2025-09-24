// app/login/page.tsx
import { signIn } from "@/auth"
import { redirect } from "next/navigation"
import { AuthError } from "next-auth"


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { LogIn, TriangleAlert } from "lucide-react"
import { isRedirectError } from "next/dist/client/components/redirect-error"

type Props = {
  searchParams?: { error?: string }
}

export default function LoginPage({ searchParams }: Props) {
  async function loginAction(formData: FormData) {
    "use server"

    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      await signIn("credentials", {
        email,
        password,
        redirectTo: "/", // adónde mandarlo si funciona
      })
    } catch (err) {
      // si fue un redirect exitoso, re-lanzarlo
      if (isRedirectError(err)) throw err

      if (err instanceof AuthError) {
        // credenciales inválidas
        if (err.type === "CredentialsSignin") {
          redirect("/login?error=Credenciales%20inv%C3%A1lidas")
        }
        // otros errores de auth (csrf, provider, etc.)
        redirect("/login?error=No%20se%20pudo%20iniciar%20sesi%C3%B3n")
      }

      // fallback genérico
      redirect("/login?error=Ocurri%C3%B3%20un%20error%20inesperado")
    }
  }

  const error = searchParams?.error

  return (
    <div className="flex min-h-screen items-center justify-center bg-amber-50 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold">Trading Dashboard</CardTitle>
          <CardDescription>
            Ingresa con tus credenciales para acceder al sistema
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Alert de error si viene por querystring */}
          {error && (
            <Alert variant="destructive" className="mb-4">
              <TriangleAlert className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{decodeURIComponent(error)}</AlertDescription>
            </Alert>
          )}

          <form action={loginAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input id="email" name="email" type="email" placeholder="tucorreo@mail.com" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" name="password" type="password" placeholder="••••••••" required />
            </div>

            <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-white">
              <LogIn className="mr-2 h-4 w-4" />
              Entrar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
