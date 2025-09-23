// app/actions.ts
'use server'

import { Paginate } from '@/app/type';
import { Indicator, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function technicalIndicatorGetAll( params : Paginate = {}) {
  
  const {  page = 1, pageSize = 5 } = params;


  const data = await prisma.indicator.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: { calculatedAt: 'desc' },
  });
  // Optionally, you can revalidate a specific path after the action is performed
  //revalidatePath("/");
  return  data.map((indicator: Indicator) => ({
    ...indicator,
    adx14: indicator.adx14 && typeof indicator.adx14 === "string" ? JSON.parse(indicator.adx14) : indicator.adx14,
    macd: indicator.macd && typeof indicator.macd === "string" ? JSON.parse(indicator.macd) : indicator.macd,
    bollinger: indicator.bollinger && typeof indicator.bollinger === "string" ? JSON.parse(indicator.bollinger) : indicator.bollinger,
    stochastic: indicator.stochastic && typeof indicator.stochastic === "string" ? JSON.parse(indicator.stochastic) : indicator.stochastic,
  }))
}
