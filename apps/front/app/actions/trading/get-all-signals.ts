
'use server'

import { Paginate, Signal } from '@/app/type';
import { PrismaClient, Prisma, $Enums } from '@prisma/client';

const prisma = new PrismaClient()
type TradingSignalWhereInput = Prisma.TradingSignalWhereInput;


type TradingGetAllSignalsParams = Paginate & {
  status?: $Enums.SignalStatus;
};



export async function tradingGetAllSignals(params: TradingGetAllSignalsParams = {}) : Promise<Signal[]> {


  const { status, q, page = 1, pageSize = 10 } = params;
  
  const where: TradingSignalWhereInput = {};

  if (status) {
    where.status = status as $Enums.SignalStatus;
  }
  
  if (q) {
    where.OR = [
      { symbol: { contains: q, mode: 'insensitive' } },
    ];
  }

  const data = await prisma.tradingSignal.findMany({
    where,
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: { createdAt: 'desc' },
  });


  return data.map(d=>({
    ...d,
   id: d.id.toString(),
   
  }));
}
