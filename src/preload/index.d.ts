import { FetchStockData } from "@shared/context"
import { Candle } from "@shared/models"

declare global {
  interface Window {
    context: {
      ping: void
      fetchStockData: FetchStockData
    }
  }
}
