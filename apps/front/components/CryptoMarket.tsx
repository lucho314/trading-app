
import { getTickers } from "@/app/actions/trading/getTickers"
import CryptoMarketClient from './CryptoMarketClient';
import { Card } from "./ui/card";


export default async function CryptoMarket() {
  const initialData = await getTickers()

  return (
    <Card className="bg-card text-card-foreground rounded-lg p-4 shadow-md w-full max-w-md mx-auto">
      <CryptoMarketClient initialData={initialData} />
    </Card>
    
  )
}
