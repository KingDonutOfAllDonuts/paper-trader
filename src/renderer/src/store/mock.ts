import { AccountInfo } from "@shared/models"



// ADD STATING CASH BALANCE



export const mockAccounts:AccountInfo[] = [
  {
    name: 'John Doe',
    cashBalance: 1500,
    startingCash: 2720,
    positions: [
      {
        symbol: 'AAPL',
        quantity: 8,
      },
    ],
    buyHistory: [
      {
        symbol: 'AAPL',
        quantity: 5,
        purchasePrice: 150.0,
        purchaseDate: '2023-10-01',
      },
      {
        symbol: 'AAPL',
        quantity: 5,
        purchasePrice: 160.0,
        purchaseDate: '2023-10-15',
      },
    ],
    sellHistory: [
      {
        symbol: 'AAPL',
        quantity: 2,
        sellPrice: 165.0,
        sellDate: '2023-10-03',
      },
    ],

    lastAction: Date.now(),
    accountCreationDate: new Date(2022,5,27).getTime(),
  },
  {
    name: 'Star Proer Trading',
    cashBalance: 1500,
    startingCash: 4445,
    positions: [
      {
        symbol: 'SPY',
        quantity: 5,
      },
      {
        symbol: 'RDDT',
        quantity: 8,
      },
    ],
    buyHistory: [
      {
        symbol: 'SPY',
        quantity: 5,
        purchasePrice: 150.0,
        purchaseDate: '2024-08-01',
      },
      {
        symbol: 'SPY',
        quantity: 5,
        purchasePrice: 160.0,
        purchaseDate: '2024-08-15',
      },
      {
        symbol: 'RDDT',
        quantity: 5,
        purchasePrice: 150.0,
        purchaseDate: '2024-08-01',
      },
      {
        symbol: 'RDDT',
        quantity: 5,
        purchasePrice: 160.0,
        purchaseDate: '2024-08-15',
      },
    ],
    sellHistory: [
      {
        symbol: 'SPY',
        quantity: 5,
        sellPrice: 165.0,
        sellDate: '2024-08-12',
      },
      {
        symbol: 'RDDT',
        quantity: 2,
        sellPrice: 165.0,
        sellDate: '2024-08-20',
      },
    ],

    lastAction: Date.now(),
    accountCreationDate: new Date(2024,6,27).getTime()
  },
]