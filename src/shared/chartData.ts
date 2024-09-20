import { CandlestickData, LineData, Time } from "lightweight-charts";
import { AccountInfo } from "./models";
import { calculateBalance, createTransactionTimeline, getCurrentStockPrice, getHistory, getPositionHistory, getTimestamps } from "./utils";

export const getAccountBalanceHistory = async(acc:AccountInfo, stockData):Promise<LineData<Time>[]> => {
  const data = await getHistory(acc, "1y")
  const timeStamps = await getTimestamps("1y")

  const accountData:LineData<Time>[]  = []
  // get every week data
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());  
  let i = 0
  let todayIncluded = false;

  //follow positions
  const transactions = createTransactionTimeline(acc)
  let currentPositions = {};
  let currCash = acc.startingCash; 

  for (const date of timeStamps) {
    if (date >= today) {todayIncluded=true; break}
    if (acc.accountCreationDate > date.getTime()) {continue}
    
    //update follow positions
    while (transactions.length && transactions[0].date <= date) {
      const transaction = transactions.shift(); // Get and remove the earliest transaction
      const { symbol, type, quantity, price } = transaction;

      if (type === 'Buy') {
        if (!currentPositions[symbol]) {
          currentPositions[symbol] = 0; // Initialize the position if it's the first buy
        }
        currentPositions[symbol] += quantity; // Increase position by quantity bought
        currCash -= quantity * price; // Decrease cash balance by the total buy price
      } else if (type === 'Sell') {
        currentPositions[symbol] -= quantity; // Decrease position by quantity sold
        currCash += quantity * price; // Increase cash balance by the total sell price

        // If the position is completely sold, remove it
        if (currentPositions[symbol] <= 0) {
          delete currentPositions[symbol];
        }
      }
    }

    let value = 0
    for (const symbol in currentPositions) {
      const pos = data[symbol]
      if (!pos.chartData[date.getTime()]) {continue}
      value+=pos.chartData[date.getTime()].close*currentPositions[symbol]
    }
    value+= currCash
    const year = date.getFullYear();
    const month = date.getMonth() + 1; 
    const day = date.getDate();
    accountData.push(
      {
        color: "#000000",
        time:  {year, month, day},
        value: value
      }
    )
  }
  if (todayIncluded) {
    accountData.push(
      {
        color: "#000000",
        time:  {year:today.getFullYear(), month:today.getMonth()+1, day:today.getDate()},
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
    const year = date.getFullYear();
    const month = date.getMonth() + 1; 
    const day = date.getDate();
    stockData.push(
      {
        time: {year, month, day},
        open: dateData.open,
        close: dateData.close,
        high: dateData.high,
        low: dateData.low
      }
    )
  }

  return stockData
}