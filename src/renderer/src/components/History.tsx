import { months } from '@shared/constants';
import { portfolioContext } from '@shared/models';
import { createTransactionTimeline, formatNumber } from '@shared/utils';
import React, { useState } from 'react'
import { useOutletContext } from 'react-router-dom';

const History = () => {
  const [acc, stockData] = useOutletContext<portfolioContext>()
  const transactions = createTransactionTimeline(acc)
  const [searchTerm, setSearchTerm] = useState("")

  // Filter transactions based on search term
  const filteredTransactions = transactions.filter((transaction) => {
    const date = `${months[transaction.date.getMonth()]} ${transaction.date.getDate()}, ${transaction.date.getFullYear()}`
    return transaction.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    date.toLowerCase().includes(searchTerm.toLowerCase())
  }
  )
  filteredTransactions.reverse()

  return (
    <div className='p-4'>
      <h1 className='text-2xl mb-4'>Transaction History</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search Stock or Date"
        className="p-2 mb-4 border border-gray-300 rounded-md w-full"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Transaction Table */}
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b text-left">Date</th>
            <th className="py-2 px-4 border-b text-left">Description</th>
            <th className="py-2 px-4 border-b text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction, index) => {
              const date = `${months[transaction.date.getMonth()]} ${transaction.date.getDate()}, ${transaction.date.getFullYear()}`
              return <tr key={index} className="hover:bg-gray-100 border-b">
                <td className="text-xl p-2">{date}</td>
                <td className="text-xl p-2">{`${transaction.type == "Buy" ? "Bought" : "Sold"} ${transaction.quantity} shares of ${transaction.symbol}`}</td>
                <td className="text-xl text-right p-2">{formatNumber(transaction.price*transaction.quantity)}</td>
              </tr> 
            })
          
          ) : (
            <tr>
              <td colSpan={3} className="py-4 text-center">No transactions found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default History