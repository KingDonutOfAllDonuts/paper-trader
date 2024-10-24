import { AccountInfo, CandleData, Stock } from "./models"
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

export type StoreResponse = Promise<AccountInfo[] | string>

export type GetAccountData = () => Promise<AccountInfo[]>
export type CreateAccount = (name:string, startingCash:number) => StoreResponse
export type DeleteAccount = (name:string) => StoreResponse
export type BuyStock = (name:string, symbol:string, quantity:false) => StoreResponse
export type SellStock = (name:string, symbol:string, quantity:false) => StoreResponse