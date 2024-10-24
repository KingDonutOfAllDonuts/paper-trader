import { CandlestickData, LineData, Time, UTCTimestamp } from "lightweight-charts";
import { AccountInfo } from "../../../shared/models";
import { calculateBalance, createTransactionTimeline, getHistory, getPositionHistory, getTimestamps } from "./utils";

export const getAccountBalanceHistory = async(acc:AccountInfo, stockData):Promise<LineData<Time>[]> => {
  const data = await getHistory(acc, "1y")
  const timeStamps = await getTimestamps("1y")

  const accountData:LineData<Time>[]  = []
  //follow positions
  const transactions = createTransactionTimeline(acc)
  let currentPositions = {};
  let currCash = acc.startingCash;
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let todayIncluded=false

  for (const date of timeStamps) {
    if (date >= today) {todayIncluded=true; break}
    if (acc.accountCreationDate > date.getTime()) {continue}

    //date.setUTCFullYear(date.getFullYear(), date.getMonth(), date.getDate())
    
    //update follow positions
    while (transactions.length && transactions[0].date <= date) {
      const transaction = transactions.shift();
      const { symbol, type, quantity, price } = transaction;

      if (type === 'Buy') {
        if (!currentPositions[symbol]) {
          currentPositions[symbol] = 0; 
        }
        currentPositions[symbol] += quantity; 
        currCash -= quantity * price;
      } else if (type === 'Sell') {
        currentPositions[symbol] -= quantity; 
        currCash += quantity * price; 

        if (currentPositions[symbol] <= 0) {
          delete currentPositions[symbol];
        }
      }
    }

    //get todays value
    let value = 0
    for (const symbol in currentPositions) {
      const pos = data[symbol]
      if (!pos.chartData[date.getTime()]) {continue}
      value+=pos.chartData[date.getTime()].close*currentPositions[symbol]
    }
    value+= currCash
    const time = Math.floor(date.getTime() / 1000) as UTCTimestamp
    accountData.push(
      {
        color: "#000000",
        time: time, 
        value: value
      }
    )
  }
  if (todayIncluded) {//maybe remove idk
    accountData.push(
      {
        color: "#000000",
        time:  (Math.floor(today.getTime()/ 1000) as UTCTimestamp),
        value: calculateBalance(acc, stockData)
      }
    )
  }
  return accountData
}

export const getStockHistory = async(symbol:String, period):Promise<CandlestickData<Time>[]> => {
  const data = await getPositionHistory(symbol, period)
  const stockData:CandlestickData<Time>[] = []
  const chartData = data.chartData

  for (const d in chartData) {
    const dateData = chartData[d]
    const date = new Date(parseInt(d))
    const time = Math.floor(date.getTime() / 1000) as UTCTimestamp
    stockData.push(
      {
        time: time, 
        open: dateData.open,
        close: dateData.close,
        high: dateData.high,
        low: dateData.low
      }
    )
  }

  return stockData
}