import { CandleData, Stock } from "./models"
export type FetchedData = {
  metaData: Object,
  chartData: CandleData
}
export type FetchedNewsData = {
  headline: string
  source: string
  link: string
}
export type FetchNews = (stock: string) => Promise<FetchedNewsData[]>
export type FetchStockData = (request: Request) => Promise<FetchedData | number>
export type FetchActiveSymbols = () => Promise<Stock[] | null>
export type Request = {
  symbol: string, interval: string, period: string
}