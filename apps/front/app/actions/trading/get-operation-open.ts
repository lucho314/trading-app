// app/actions.ts
'use server'

import { bybitClient } from '@/lib/bybit';




export async function tradingGetOperationOpen() {

  bybitClient.getSpreadOpenOrders().then((response) => {
    console.log("Open Orders:", response);
  }).catch((error) => {
    console.error("Error fetching open orders:", error);
  });
 

}
