import { portfolioContext } from '@shared/models'
import React, { useRef } from 'react'
import { useOutletContext } from 'react-router-dom'
import AccountBalanceChart from './AccountBalanceChart'
import { calculateBalance, calculateTodaysPositionEarning, formatNumber, getCurrentStockPrice } from '@shared/utils'
import Earnings from './Earnings'
import PercentageEarnings from './PercentageEarnings'

const Summary = () => {
  const [acc, stockData] = useOutletContext<portfolioContext>()
  if (!stockData) {return;}
  const chartDivRef = useRef<HTMLDivElement>(null)

  //get top stocks
  const topStocks = [...acc.positions]
  .sort((a, b) => b.quantity*getCurrentStockPrice(b, stockData) - a.quantity*getCurrentStockPrice(a, stockData))
  .slice(0, 5);

  return (
    <div className='portfolio-size flex relative'>
      
      <div className='flex-1 flex flex-col m-2'>
        <div className='flex-1 border border-gray-300 rounded-md p-3'>
          <p className='text-xl'>Balance</p>
          <p className='text-3xl font-bold'>{formatNumber(calculateBalance(acc, stockData))}</p>
           {/* graph */}
          <div className='h-[300px] w-full' ref={chartDivRef}>
            <AccountBalanceChart stockData={stockData} className='absolute' acc={acc} divRef={chartDivRef}/>
          </div>

        </div>
      </div>

      <div className='flex-1 flex flex-col m-2'>
        {/* Top stocks */}
        <div className='flex-1 border border-gray-300 rounded-md p-3'>
          <p className='text-2xl border-b-2 pb-3'>
            Your Top Stocks
          </p>
          {topStocks.map((pos, i) => {
            const todaysEarnings = calculateTodaysPositionEarning(pos, stockData)
            const currStockPrice = getCurrentStockPrice(pos, stockData)
            return <li key={i} className='flex justify-between mt-3'>
                <div className='flex flex-col'>
                  <p className='text-xl lg:text-2xl'>{pos.symbol}</p>
                  <p className='text-sm text-gray-500 lg:text-xl'>{stockData[pos.symbol]["shortName"]}</p>
                </div>
                <div className='flex flex-col items-end'>
                  <Earnings className="text-xl lg:text-2xl" earnings={todaysEarnings*pos.quantity}/>
                  <PercentageEarnings className="text-sm lg:text-xl" percentage={todaysEarnings/currStockPrice}/>
                </div>
              </li>
          })}
        </div>

      </div>

    </div>
  )
}

export default Summary