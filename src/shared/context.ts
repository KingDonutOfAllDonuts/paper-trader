import { CandleData } from "./models"
export type FetchedData = {
  metaData: Object,
  chartData: CandleData
}
export type FetchStockData = (request: Request) => Promise<FetchedData | null>
export type Request = {
  symbol: string, interval: {id: string, value: string}, period: string
}