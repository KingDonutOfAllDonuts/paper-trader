import { AccountInfo } from "@shared/models"



// ADD STATING CASH BALANCE



export const mockAccounts:AccountInfo[] = [
  {
    name: 'John Doe',
    cashBalance: 1500,
    startingCash: 2700,
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
    name: 'Cool Person',
    cashBalance: 2752.29,
    startingCash: 10000,
    positions: [
      {
        symbol: 'SPY',
        quantity: 5,
      },
      {
        symbol: 'RDDT',
        quantity: 8,
      },
      {
        symbol: 'MSFT',
        quantity: 10,
      },
      {
        symbol: 'SNOW',
        quantity: 5,
      },
    ],
    buyHistory: [
      {
        symbol: 'SPY',
        quantity: 5,
        purchasePrice: 518.43,
        purchaseDate: '2024-04-05',
      },
      {
        symbol: 'SPY',
        quantity: 5,
        purchasePrice: 442.71,
        purchaseDate: '2023-09-19',
      },
      {
        symbol: 'RDDT',
        quantity: 5,
        purchasePrice: 59.38,
        purchaseDate: '2024-08-01',
      },
      {
        symbol: 'RDDT',
        quantity: 5,
        purchasePrice: 57.53,
        purchaseDate: '2024-09-03',
      },
      {
        symbol: 'MSFT',
        quantity: 10,
        purchasePrice: 413.52,
        purchaseDate: '2023-05-03',
      },
      {
        symbol: 'SNOW',
        quantity: 10,
        purchasePrice: 163.29,
        purchaseDate: '2023-02-03',
      }
    ],
    sellHistory: [
      {
        symbol: 'SPY',
        quantity: 5,
        sellPrice: 541.36,
        sellDate: '2024-06-12',
      },
      {
        symbol: 'RDDT',
        quantity: 2,
        sellPrice: 55.02,
        sellDate: '2024-08-20',
      },
      {
        symbol: 'SNOW',
        quantity: 5,
        sellPrice: 218.76,
        sellDate: '2024-02-03',
      }
    ],

    lastAction: Date.now(),
    accountCreationDate: new Date(2022,6,27).getTime()
  },
]