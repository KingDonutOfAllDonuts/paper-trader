import { FetchActiveSymbols, FetchNews, FetchStockData } from "@shared/context"
import { Candle } from "@shared/models"

declare global {
  interface Window {
    context: {
      ping: void
      fetchStockData: FetchStockData
      fetchActiveSymbols: FetchActiveSymbols
      fetchNews: FetchNews
    }
  }
}
