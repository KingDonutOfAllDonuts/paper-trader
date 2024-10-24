import { baseAccount } from '@shared/constants'
import { AccountInfo } from '@shared/models'
import storage from 'electron-json-storage'
import { getHistory } from './yfinance'
import _ from "lodash"
const storageDir = storage.getDataPath()
let data: AccountInfo[] = storage.getSync(storageDir)
console.log(storageDir)

const findAccoundIndex = async(name):Promise<string|null> => {
  for (const i in data) {
    const acc = data[i]
    if (acc.name == name) {return i}
  }
  return null
}
const findPosition = async(acc:AccountInfo, symbol):Promise<string|null> => {
  for (const i in acc.positions) {
    const position = acc.positions[i]
    if (position.symbol == symbol) {return i}
  }
  return null
}

const saveData = async(newData): Promise<AccountInfo[] | string> => {
  try {
    await new Promise<void>((resolve, reject) => {
      storage.set(storageDir, newData, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
    data = newData 
    // Return the updated data on success
    return data;
  } catch (error) {
    // Return the error message as a string
    return `Failed to create account: ${error}`;
  }
}

export const getAccountData = (): AccountInfo[] => {
  return data
}

export const createAccount = async (name: string, startingCash: number): Promise<AccountInfo[] | string> => {
  const newData = _.cloneDeep(data)
  if (await findAccoundIndex(name) != null) {
    return 'Error making account: Account name is already taken :('
  }
  const newAccount: AccountInfo = {
    ...baseAccount,
    name,
    lastAction: Date.now(),
    accountCreationDate: Date.now(),
    startingCash,
    cashBalance: startingCash,
  };
  newData.push(newAccount);
  return saveData(newData)
};

export const deleteAccount = async (name:string): Promise<AccountInfo[] | string> => {
  const newData = _.cloneDeep(data)
  const i = await findAccoundIndex(name)
  if (i!=null) {
    newData.splice(parseInt(i),1)
    return saveData(newData)
  }
  return `Error deleting account: Could not find ${name}`
}

export const buyStock = async(name, symbol, quantity):Promise<AccountInfo[] | string> => {
  const i = await findAccoundIndex(name)
  if (i==null) {return `Failed to buy ${symbol}: Account does not exist.`}
  const newData = _.cloneDeep(data)
  const acc:AccountInfo = newData[i]
  let stockData = await getHistory({
    symbol,
    interval: '1d',
    period: '1m',
  })
  let tries = 0
  while (typeof stockData === 'number') {
    stockData = await getHistory({
      symbol,
      interval: '1d',
      period: '1m',
    })
    if (++tries <= 3) {
      return `Failed to buy ${symbol}: Could not fetch stock price.`
    }
  }
  const cost = stockData.metaData["regularMarketPrice"]*quantity
  if (acc.cashBalance >= cost) {
    acc.cashBalance-=cost
    const index = await findPosition(acc, symbol)
    if (index != null) {
      acc.positions[index].quantity+=quantity
    } else {
      await acc.positions.push({
        symbol,
        quantity,
      })
    }
    await acc.buyHistory.push({
      symbol,
      quantity,
      purchasePrice:stockData.metaData["regularMarketPrice"],
      purchaseDate: Date.now()
    })
    acc.lastAction = Date.now()
    return saveData(newData)
  } 
  return `Failed to buy ${symbol}: Not enough cash balance in account.`
}

export const sellStock = async(name, symbol, quantity):Promise<AccountInfo[] | string> => {
  const i = await findAccoundIndex(name)
  if (i==null) {return `Failed to sell ${symbol}: Account does not exist.`}
  const newData = _.cloneDeep(data)
  const acc:AccountInfo = newData[i]
  let stockData = await getHistory({
    symbol,
    interval: '1d',
    period: '1m',
  })
  let tries = 0
  while (typeof stockData === 'number') {
    stockData = await getHistory({
      symbol,
      interval: '1d',
      period: '1m',
    })
    if (++tries <= 3) {
      return `Failed to sell ${symbol}: Could not fetch stock price.`
    }
  }
  const cost = stockData.metaData["regularMarketPrice"]*quantity
  const posIndex =await findPosition(acc, symbol)
  if (posIndex!=null &&  acc.positions[posIndex].quantity >= quantity) {
    acc.cashBalance+=cost
    acc.positions[posIndex].quantity-=quantity
    await acc.sellHistory.push({
      symbol,
      quantity,
      sellPrice:stockData.metaData["regularMarketPrice"],
      sellDate: Date.now()
    })
    acc.lastAction = Date.now()
    return saveData(newData)
  } 
  return `Failed to sell ${symbol}: Not enough shares in account.`
}