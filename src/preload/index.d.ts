import { BuyStock, CreateAccount, DeleteAccount, FetchActiveSymbols, FetchNews, FetchStockData, GetAccountData, SellStock } from "@shared/context"

declare global {
  interface Window {
    context: {
      ping: void
      fetchStockData: FetchStockData
      fetchActiveSymbols: FetchActiveSymbols
      fetchNews: FetchNews
      
      getAccountData: GetAccountData
      createAccount: CreateAccount
      deleteAccount: DeleteAccount
      buyStock: BuyStock
      sellStock: SellStock
    }
  }
}
