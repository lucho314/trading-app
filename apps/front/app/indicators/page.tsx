import { technicalIndicatorGetAll } from "@/app/actions/technical-indicator/get-all"
import IndicatorsList from "@/components/IndicatorsList"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, BarChart3 } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function IndicatorsPage() {
  const indicators = await technicalIndicatorGetAll({ page: 1, pageSize: 5})


  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Indicadores Técnicos</h1>
              <p className="text-muted-foreground">Análisis técnico en tiempo real de tus instrumentos</p>
            </div>
          </div>
            {/* Botón Volver */}
          <Link href="/" passHref>
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Button>
          </Link>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Indicadores Activos</CardTitle>
            <CardDescription>Datos técnicos actualizados de tus instrumentos de trading</CardDescription>
          </CardHeader>
          <CardContent>
            <IndicatorsList  initialIndicators={indicators} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
