import { webContents } from "electron";
import { LineData, Time } from "lightweight-charts";
import { AccountInfo, CandleData } from "./models";
import { FetchedData, FetchStockData } from "./context";
import { intervals } from "./constants";

export const getPositionHistory = async(symbol, period): Promise<FetchedData> => {
  let data = await window.context.fetchStockData({
    symbol: symbol,
    interval: intervals[period],
    period: period
  })
  while (data==null) {    
    await sleep(1000)  
    data = await window.context.fetchStockData({
      symbol: symbol,
      interval: intervals[period],
      period: period
    })
  }
  return data
}

export const getHistory = async(acc, period) => {
  const data = {}
  for (const pos of acc.positions) {
    data[pos.symbol] = await getPositionHistory(pos.symbol, period)
  }
  return data;
}

export const getTimestamps = async(period): Promise<Date[]> => {
  const timeStamps:Date[] = []
  const data = await getPositionHistory("DJIA", period)
  const chartData = data.chartData

for (const date in chartData) {
    // Now you're looping in reverse order
    timeStamps.push(new Date(parseInt(date)));
} 
  return timeStamps
} 

export const formatNumber = (num) => {

  return `$${(Math.round(Math.abs(num) * 100) / 100).toFixed(2)}`
}

export const formatPercentage = (num) => {

  return `${(Math.round(Math.abs(num*100) * 100) / 100).toFixed(2)}%`
}

export const sleep = (ms) => new Promise(r => setTimeout(r, ms));


export const calculateBalance = (acc, stockData) => {
  let currentBalance = acc.cashBalance
  for (const pos of acc.positions) {
      currentBalance+= getCurrentStockPrice(pos, stockData) * pos.quantity
  }
  return currentBalance
}

export const calculateTodaysEarning = (acc, stockData) => {
  let earnings = 0
  for (const pos of acc.positions) {
      
      earnings+= pos.quantity * calculateTodaysPositionEarning(pos, stockData)
  }
  return earnings
}

export const calculateTodaysPositionEarning = (pos, stockData) => {
  const metaData = stockData[pos.symbol]
  return metaData["regularMarketPrice"]-metaData["previousClose"]
}

export const calculateTotalPositionEarning = (pos, stockData) => {
  const metaData = stockData[pos.symbol]
  return metaData["regularMarketPrice"]-metaData["previousClose"]
}

export const getCurrentStockPrice = (pos, stockData) => {
  return stockData[pos.symbol]["regularMarketPrice"]
}

export const createTransactionTimeline = (acc) => {
  // Combine buy and sell history into one array with type and date sorted
  const transactions = acc.buyHistory.map(transaction => ({
    type: 'Buy',
    symbol: transaction.symbol,
    quantity: transaction.quantity,
    price: transaction.purchasePrice,
    date: new Date(transaction.purchaseDate)
  }))
  .concat(acc.sellHistory.map(transaction => ({
    type: 'Sell',
    symbol: transaction.symbol,
    quantity: transaction.quantity,
    price: transaction.sellPrice,
    date: new Date(transaction.sellDate)
  })))
  .sort((a, b) => a.date - b.date); // Sort by date

  return transactions;
}

export const calculateBoughtValue = (acc, pos) => {
  const tm = createTransactionTimeline(acc)

  let currentValue = 0;
  let weight = 0;
  for (const transaction of tm) {
    if (transaction.symbol != pos.symbol) {continue}
    if (transaction.type.match("Buy")) {
      currentValue= (transaction.price+ weight*currentValue)/(++weight)
    } else {
      if (weight-- <= 0) {
        weight=0
        currentValue=0
      }
      
    }
    
  }
  return currentValue
}