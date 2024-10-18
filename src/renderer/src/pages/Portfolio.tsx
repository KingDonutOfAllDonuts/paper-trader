import RefreshButton from '@renderer/components/RefreshButton'
import { accountDataAtom, selectedIndexAtom, updateAllAccountsAtom } from '@renderer/store'
import { baseAccount, portfolioPages } from '@shared/constants'
import { AccountInfo, portfolioContext } from '@shared/models'
import { useAtomValue, useSetAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'


const Portfolio = () => {
  const selectedIndex = useAtomValue(selectedIndexAtom)
  const data = useAtomValue(accountDataAtom)
  const updateAllAccounts = useSetAtom(updateAllAccountsAtom)

  const [refreshKey, setRefreshKey] = useState(0);
  if (selectedIndex == null) {
    return (
      <div className='page-size flex flex-center'>
        <Link to="/home" className='page-heading hover:text-zinc-400 transition-all'>
          Please select or create a new account!
        </Link>
      </div>
    )
  } else {

    var acc:AccountInfo;
    if (data == null) {acc = baseAccount} 
    else {acc = data.accounts[selectedIndex]}
    const handleRefresh = () => {
      if (acc==baseAccount) {return}
      setRefreshKey(prevKey => prevKey + 1);
      updateAllAccounts()
    };
    const stockData = data?.stockData 
    return (
      <div className='page-size flex flex-col'>
        <div className='mt-3 mb-3 w-full flex items-end justify-between'>
          <h1 className='page-heading'>{acc.name}</h1>
          {/* <p className='page-heading text-black font-medium'>{formatNumber(calculateBalance(acc, stockData))}</p> */}
        </div>

        <nav className='mx-2'>
          <ul className="flex justify-between space-x-4 border-b">
            <div className='flex'>
              {portfolioPages.map((v, i) => (
                <li key={i}>
                <NavLink
                  to={`/portfolio/${v.toLowerCase()}`}
                  className={({ isActive }) =>
                    isActive
                      ? 'text-lg py-2 px-4 text-blue-500 border-b-2 border-blue-500 flex items-center'
                      : 'text-lg py-2 px-4 text-gray-600 hover:text-blue-500 border-b-2 border-transparent flex items-center'
                  }
                >
                  {v}
                </NavLink>
              </li>
              ))}
            </div>
            <RefreshButton 
            className="mx-7 hover:bg-gray-200 transition-all rounded-full p-1"
            onClick={()=>{handleRefresh()}
            }/>
          </ul>
        </nav>
        
        <Outlet key={refreshKey} context={[acc, stockData] satisfies portfolioContext}/>
      </div>
    )
  }
}

export default Portfolio