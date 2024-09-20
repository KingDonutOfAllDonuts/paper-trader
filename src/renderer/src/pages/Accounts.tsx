import AccountList from '@renderer/components/AccountList'
import RefreshButton from '@renderer/components/RefreshButton'
import {updateAllAccountsAtom } from '@renderer/store'

import {useSetAtom } from 'jotai'


const Accounts = () => {
  const updateAllAccounts = useSetAtom(updateAllAccountsAtom)

  return (
    <div className='page-size flex flex-col'>
      <div className='mb-6 w-full flex items-end justify-between'>
        <h1 className='page-heading'>Accounts</h1>
        <p className='link m-5 overflow-dots'> + create new account</p>
      </div>
      <div className='w-full flex justify-end'>
        <RefreshButton 
          className="mx-7 hover:bg-gray-200 transition-all rounded-full p-1"
          onClick={()=>{updateAllAccounts()}
        }/>
      </div>
      <AccountList/>
    </div>
  )
}

export default Accounts