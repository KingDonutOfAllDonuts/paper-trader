import { atom, useSetAtom} from "jotai";
import { mockAccounts } from "./mock";
import { AccountData, AccountInfo } from "@shared/models";
import {unwrap} from 'jotai/utils'
import { getHistory } from "@shared/utils";

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
  const accounts = mockAccounts;
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

//store

const accountDataAtomAsync = atom<AccountData | Promise<AccountData>>(loadAccounts())
export const accountDataAtom = unwrap(accountDataAtomAsync)
export const selectedIndexAtom = atom<number|null>(null)
//updating data

const getAccountFromName = (accounts, name) => {
  for (const acc of accounts) {
    if (acc.name == name) {
      return acc
    }
  }
}

export const updateAccountAtom = atom(null, async(get, set, name) => {
  const data = get(accountDataAtom)
  if (!data || data.isUpdating) {return}
  set(accountDataAtom, {
    ...data,
    isUpdating: true
  })
  const accounts = data.accounts
  const acc = getAccountFromName(accounts, name)
  const stockData = await updateAcc(acc)
  set(accountDataAtom, 
    {
      accounts: accounts.map((v) => {
        if (v.name == name) {
          return acc
        }
        return v
      }),
      stockData: stockData,
      isUpdating: false
    }
  )
})

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