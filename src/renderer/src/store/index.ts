import { atom, useSetAtom} from "jotai";
import { mockAccounts } from "./mock";
import { AccountData, AccountInfo, Stock } from "@shared/models";
import {unwrap} from 'jotai/utils'
import { getHistory } from "@renderer/store/utils";

const updateAcc = async(acc, stockData = {}) => {
  
  const data = await getHistory(acc, "1d")

  for (const symbol in data) {
    if (data.hasOwnProperty(symbol)) {
       stockData[symbol] = data[symbol]["metaData"]
    }
  }
  return stockData
}

const loadAccounts= async() => {
  const accounts = await window.context.getAccountData();
  accounts.sort((a, b) => b.lastAction - a.lastAction)
  const stockData = {}

  const promiseArray:Promise<Object>[] = []
  for (const acc of accounts) {
    promiseArray.push(updateAcc(acc, stockData))
  }
  await Promise.all(promiseArray)
  return {
    accounts:accounts,
    stockData:stockData,
    isUpdating: false,
  }
}

const getActiveStocks = async () => {
  return window.context.fetchActiveSymbols()
  .then((stocks) => {
    if (stocks != null) {
      return stocks;
    } else {
      console.log("failed to fetch ")
      return null
    }
  })
  .catch((error) => {
    console.log("Failed to fetch symbols "+error)
  })
};

//store
const activeStocksAsync = atom<Promise<Stock[] | null | void>>(getActiveStocks())
export const activeStocksAtom = unwrap(activeStocksAsync)

const accountDataAtomAsync = atom<AccountData | Promise<AccountData>>(loadAccounts())
export const accountDataAtom = unwrap(accountDataAtomAsync)
export const selectedIndexAtom = atom<number|null>(null)
//updating data

export const updateAllAccountsAtom = atom(null, async(get, set) => {
  const data = get(accountDataAtom)
  if (!data || data.isUpdating) {return}
  set(accountDataAtom, {
    ...data,
    isUpdating: true
  })

  const accounts = data.accounts
  if (!accounts) {return}

  const stockData = {}
  const promiseArray:Promise<Object>[] = []
  for (const acc of accounts) {
    promiseArray.push(updateAcc(acc, stockData))
  }
  await Promise.all(promiseArray)

  set(accountDataAtom, 
    {
      accounts:accounts,
      stockData: stockData,
      isUpdating: false
    }
  )
})