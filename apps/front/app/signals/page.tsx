import { tradingGetAllSignals } from "@/app/actions/trading/get-all-signals"
import { SignalsGrid } from "@/components/signals-grid"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, TrendingUp } from "lucide-react"
import Link from "next/link"
export const dynamic = "force-dynamic"

export default async function SignalsPage() {
  const signals = await tradingGetAllSignals()

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Señales de Trading</h1>
              <p className="text-muted-foreground">Gestiona y ejecuta tus señales de trading pendientes</p>
            </div>
          </div>
           <Link href="/" passHref>
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Button>
          </Link>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Señales Pendientes</CardTitle>
            <CardDescription>Señales activas que puedes ejecutar o cancelar</CardDescription>
          </CardHeader>
          <CardContent>
            <SignalsGrid signals={signals} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
