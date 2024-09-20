import React from 'react'
import {VscAccount} from 'react-icons/vsc'
import { Link } from 'react-router-dom'
import { calculateBalance, calculateTodaysEarning, formatNumber } from '@shared/utils'
import { accountDataAtom, selectedIndexAtom } from '@renderer/store'
import LoadingSpinner from '@renderer/components/LoadingSpinner'
import { useAtomValue, useSetAtom } from 'jotai'
import Earnings from './Earnings'


const AccountList = () => {
  const data = useAtomValue(accountDataAtom)
  const stockData = data?.stockData
  const setSelectedIndex = useSetAtom(selectedIndexAtom)
  return (
    <div className='flex flex-col flex-1 rounded-md border-2 m-5 border-zinc-700 overflow-y-auto'>
        {data==null||data.isUpdating ? <LoadingSpinner/> : ''}
        {data ? 
          data.accounts.map((acc, i) => {
            const todaysEarnings = calculateTodaysEarning(acc, stockData)
            
            return <Link 
            key={i}
            onClick={() => setSelectedIndex(i)}//set selected note index
            to="/portfolio/summary" 
            className='flex justify-start items-center cursor-pointer w-calc(100%-10px) p-1 m-2.5 rounded-md hover:bg-blue-200 bg-blue-100 h-20 sm:h-20 md:h-28 lg:h-32'
          >
            <div className= {'flex flex-col flex-1 h-full'}>
  
              <div className='flex justify-normal whitespace-nowrap overflow-hidden'>
                <VscAccount className='h-8 sm:h-8 md:h-12 lg:h-14 w-8 sm:w-8 md:w-12 lg:w-14 m-1'/>
                <div className='flex justify-between w-full'>
                  <h1 className='text-2xl sm:text-2xl md:text-4xl lg:text-5xl px-4 font-normal overflow-dots'>
                    {acc.name}
                  </h1>
                  <h1 className='flex justify-end flex-col items-end text-2xl lg:text-3xl px-4 text-medium'> 
                    {formatNumber(calculateBalance(acc, stockData))}
                    <Earnings className='max-md:text-sm lg:text-xl' earnings={todaysEarnings}/>
                  </h1>
                </div>
              </div>
  
  
            </div>
          </Link>
          
          })
          : ''
        }


      </div>
  )
}

export default AccountList