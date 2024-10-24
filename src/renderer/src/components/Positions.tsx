import { portfolioContext } from '@shared/models'
import { calculateBalance, calculateBoughtValue, calculateTodaysPositionEarning, formatNumber, getCurrentStockPrice } from '@renderer/store/utils'
import {useRef, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import Earnings from './Earnings'
import PercentageEarnings from './PercentageEarnings'
import StockChart from './StockChart'
import { intervals } from '@shared/constants'
import BuySellButton from './BuySellButton'

const Positions = () => {
  const [acc, stockData] = useOutletContext<portfolioContext>()
  if (!stockData) {return}

  const totalBalance = calculateBalance(acc, stockData)
  
  let totalTodayGains = 0
  let totalGains = 0
  const [currPeriod, setPeriod] = useState<String>("1y")
  const [selectedStock, setSelectedStock] = useState<String|false>(false);
  const handleSelect = (symbol:string) => {
    if (selectedStock==symbol) {
      setSelectedStock(false)
    } else {
      setSelectedStock(symbol)
    }
  }

  const chartContainerRef = useRef<HTMLTableRowElement>(null);

  return (
    <div className="portfolio-size">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Positions</h1>
          <p className="text-xl text-gray-600">Account Balance: {formatNumber(totalBalance)}</p>
        </header>

        {/* Table of Positions */}
        <div className="bg-white shadow-md rounded-lg">
          <table className="min-w-full text-left table-auto">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-3">Symbol</th>
                <th className="py-2 px-3">Current Price</th>
                <th className="py-2 px-3">Today's Earnings</th>
                <th className="py-2 px-3">Total Earnings</th>
                <th className="py-2 px-3">Current Value</th>
                <th className="py-2 px-3">Shares</th>
                <th className="py-2 px-3">Bought Value</th>
              </tr>
            </thead>
            <tbody>
              {/* cash */}
              <tr className="border-b">
                <td className='font-semibold text-lg py-3 px-3'>CASH</td>
                <td/>
                <td/>
                <td/>
                <td className='py-2 px-3'>
                    <span className='text-lg'>{formatNumber(acc.cashBalance)}</span>
                    <PercentageEarnings className="text-black" percentage={(acc.cashBalance/totalBalance)}/>
                  </td>
              </tr>

              {acc.positions.flatMap((position) => {
                const currStockPrice = getCurrentStockPrice(position, stockData)
                const todaysEarnings = calculateTodaysPositionEarning(position, stockData)
                const boughtValue = calculateBoughtValue(acc, position)
                //const boughtAtPrice
                totalTodayGains+= todaysEarnings*position.quantity
                totalGains+=(currStockPrice-boughtValue)*position.quantity
                return [
                  <tr 
                    key={position.symbol}
                    className={`border-b cursor-pointer ${
                      selectedStock === position.symbol ? 'bg-gray-100' : ''
                    } hover:bg-gray-100`}
                    onClick={() => handleSelect(position.symbol)}
                  >
                    <td className="py-2 px-3 flex flex-col">
                      <span className='font-semibold text-lg'>{position.symbol}</span>
                      <span>{stockData[position.symbol]["shortName"]}</span>
                    </td>
                    <td className="py-2 px-3">
                      <span className='text-lg'>{formatNumber(currStockPrice)}</span>
                      <Earnings earnings={todaysEarnings} />
                    </td>
                    <td>
                      <Earnings className="pt-2 px-3 text-lg" earnings={todaysEarnings * position.quantity} />
                      <PercentageEarnings className="px-4" percentage={todaysEarnings / currStockPrice} />
                    </td>
                    <td>
                      <Earnings className="pt-2 px-3 text-lg" earnings={(currStockPrice - boughtValue) * position.quantity} />
                      <PercentageEarnings className="px-4" percentage={((currStockPrice - boughtValue) / boughtValue)} />
                    </td>
                    <td className='py-2 px-3'>
                      <span className='text-lg'>{formatNumber(position.quantity * currStockPrice)}</span>
                      <PercentageEarnings className="text-black" percentage={((position.quantity * currStockPrice) / totalBalance)} />
                    </td>
                    <td className='py-2 px-3 text-lg'>{position.quantity}</td>
                    <td className="py-2 px-3">{formatNumber(boughtValue)}</td>
                  </tr>,
              
                  position.symbol === selectedStock && (
                    <tr key={`${position.symbol}-chart`}>
                      <td colSpan={6}>
                        <div ref={chartContainerRef} className='h-[300px]'>
                          <StockChart className='absolute' symbol={position.symbol} divRef={chartContainerRef} height={300} period={currPeriod}/>
                        </div>
                      </td>

                      <td colSpan={1} className='m-1 border flex flex-col'>
                        <div className='flex items-center flex-col'>
                          <h3 className="text-xl">Actions</h3>
                          <BuySellButton className='border-b justify-center flex flex-nowrap w-full' symbol={position.symbol}/>
                          <h3 className="text-xl mt-2">Information</h3>
                          <div className='w-full'>
                            <div className='flex items-start flex-col w-full'>
                              <div className='flex justify-between pb-1 w-full'>
                                <p className='text-base'>Value:</p>
                                <div className='text-base'>{formatNumber(currStockPrice)}</div>
                              </div>
                              <div className='flex justify-between pb-1 w-full'>
                                <p className='text-base'>1 day:</p>
                                <Earnings className='text-base' earnings={todaysEarnings}/>
                              </div>
                              <div className='flex justify-between pb-1 w-full'>
                                <p className='text-base'>Name:</p>
                                <p className='text-base'>{stockData[position.symbol]["shortName"]}</p>
                              </div>
                              <div className='flex justify-between pb-1 w-full'>
                                <p className='text-base'>Holding:</p>
                                <p className='text-base'>{position.quantity} Shares</p>
                              </div>
                            </div>
                          </div>
                          <div className="mt-2 flex flex-nowrap pb-2 border-b w-full justify-center">
                            {Object.keys(intervals).map((period, i) => {
                              return <button 
                              key={i} 
                              className={`text-sm ${currPeriod == period ? 'bg-blue-600' : 'bg-blue-500'} text-white rounded-md p-1 mr-0.5 hover:bg-blue-600`}
                              onClick={() => setPeriod(period)}
                              >
                               {period.toUpperCase()}
                              </button>
                            })}
                          </div>
                        </div>

                      </td>
                    </tr>
                  )
                ];
              })}

              <tr className="border-b bg-gray-200">
                <td className='font-semibold text-lg py-3 px-3'>TOTAL</td>
                <td/>
                <td>
                  <Earnings className="pt-2 px-3 text-lg" earnings={totalTodayGains}/>
                  <PercentageEarnings className="px-4" percentage={totalTodayGains/totalBalance}/>
                </td>
                <td>
                  <Earnings className="pt-2 px-3 text-lg" earnings={totalGains}/>
                  <PercentageEarnings className="px-4" percentage={totalGains/totalBalance}/>
                </td>
                <td className='py-2 px-3 font-bold'>
                    <span className='text-lg'>{formatNumber(totalBalance)}</span>
                </td>
                <td/>
                <td/>
              </tr>


            </tbody>
          </table>
        </div>
      </div>
  )
}

export default Positions