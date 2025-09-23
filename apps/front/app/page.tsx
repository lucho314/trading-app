import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, BarChart3, Activity } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Trading Dashboard</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Gestiona tus señales de trading y analiza indicadores técnicos en tiempo real
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Señales de Trading</CardTitle>
                  <CardDescription>Gestiona y ejecuta señales de trading pendientes</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Visualiza señales pendientes, ejecuta operaciones y cancela señales expiradas.
              </p>
              <Button asChild className="w-full">
                <Link href="/signals">Ver Señales</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Indicadores Técnicos</CardTitle>
                  <CardDescription>Analiza indicadores técnicos en tiempo real</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Revisa RSI, MACD, Bollinger Bands y otros indicadores técnicos.
              </p>
              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href="/indicators">Ver Indicadores</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 text-muted-foreground">
            <Activity className="h-4 w-4" />
            <span>Sistema de trading en tiempo real</span>
          </div>
        </div>
      </div>
    </div>
  )
}
