import { AccountInfo } from "./models";

export const baseAccount:AccountInfo = {
  name: "unknown",
  cashBalance: 0,
  positions: [],
  buyHistory: [],
  sellHistory: [],
  startingCash: 0,
  lastAction: Date.now(),
  accountCreationDate: Date.now()
}

export const portfolioPages = [
  "Summary",  
  "Positions",
  "History",
]

export const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const intervals =  {
  "1d" : "1m",
  "1mo": "1h",
  "6mo" :"1d",
  "1y" :"1d",
  "5y" : "1wk",
  "10y" :"1wk"
}