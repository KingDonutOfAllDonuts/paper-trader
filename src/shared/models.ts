import { LineData, Time } from "lightweight-charts";

type BuyTransaction = Position & {
  purchasePrice: number
  purchaseDate: string
};

type SellTransaction = Position & {
  sellPrice: number
  sellDate: string
};

export type Position = {
  symbol: string
  quantity: number
};

export type AccountInfo = {
  name: string
  cashBalance: number
  positions: Position[]
  buyHistory: BuyTransaction[]
  sellHistory: SellTransaction[]
  startingCash: number
  lastAction: number
  accountCreationDate: number

  // currentBalance: number
  // todaysEarnings: number
};

export type Candle = {
  //date : Date
  open : number
  high : number
  low : number
  close : number
  volume : number
}

export type CandleData = {
  [date: number]: Candle
}

export type AccountData = {
  accounts: AccountInfo[]
  stockData: Object
  isUpdating: boolean
}

export type portfolioContext = [acc: AccountInfo, stockData: Object| undefined];