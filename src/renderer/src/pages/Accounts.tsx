import AccountList from '@renderer/components/AccountList'
import LoadingSpinner from '@renderer/components/LoadingSpinner'
import CreateAccountPopup from '@renderer/components/popups/CreateAccountPopup'
import DeleteAccountPopup from '@renderer/components/popups/DeleteAccountPopup'
import ResponsePopup from '@renderer/components/popups/ResponsePopup'
import RefreshButton from '@renderer/components/RefreshButton'
import {accountDataAtom, updateAllAccountsAtom } from '@renderer/store'

import {useAtom, useSetAtom } from 'jotai'
import { useState } from 'react'


const Accounts = () => {
  const updateAllAccounts = useSetAtom(updateAllAccountsAtom)
  const [data, setData] = useAtom(accountDataAtom)

  const [isLoading, setIsLoading] = useState(false)
  const [{resounseIsOpen, error, response}, setResponse] = useState({
    resounseIsOpen: false,
    error: false,
    response: "",
  });
  const closeResponsePopup = () => setResponse({
    error, response,
    resounseIsOpen: false
  })
  
  
  const [isCreateAccountPopupOpen, setIsCreateAccountPopupOpen] = useState(false);
  const openCreateAccountPopup = () => setIsCreateAccountPopupOpen(true);
  const closeCreateAccountPopup = () => setIsCreateAccountPopupOpen(false);

  const handleCreateAccountSubmit = (newacc) => {
    setIsLoading(true)
    console.log(newacc)
    window.context.createAccount(newacc.accountName, newacc.cashBalance)
    .then((newAccountData) => {
      if (typeof newAccountData === 'string') {
        setResponse({resounseIsOpen:true, error:true, response:newAccountData})
        setIsLoading(false)
        return
      }
      if (!data) {setResponse({resounseIsOpen:true, error:true, response:"Data is still loading"}); return}
      setData({
        ...data,
        accounts: newAccountData
      })
      setIsLoading(false)
    })
    setResponse({resounseIsOpen:true, error:false, response:`Created new account named: ${newacc.accountName}`})
  };

  const [isDeleteAccountPopupOpen, setIsDeleteAccountPopupOpen] = useState(false);
  const openDeleteAccountPopup = () => setIsDeleteAccountPopupOpen(true);
  const closeDeleteAccountPopup = () => setIsDeleteAccountPopupOpen(false);

  const handleDeleteAccountSubmit = (name) => {
    setIsLoading(true)
    console.log(name)
    window.context.deleteAccount(name)
    .then((newAccountData) => {
      if (typeof newAccountData === 'string') {
        setResponse({resounseIsOpen:true, error:true, response:newAccountData})
        setIsLoading(false)
        return
      }
      if (!data) {setResponse({resounseIsOpen:true, error:true, response:"Data is still loading"}); return}
      setData({
        ...data,
        accounts: newAccountData
      })
      setIsLoading(false)
    })
    setResponse({resounseIsOpen:true, error:false, response:`Deleted account named: ${name}`})
  };

  return (
    <div className='page-size flex flex-col'>
      <div className='mb-6 w-full flex items-end justify-between'>
        <h1 className='page-heading'>Accounts</h1>
        <div className='flex flex-col m-6'>
          <p 
          className='link overflow-dots'
          onClick={openCreateAccountPopup}
          > 
          + create new account
          </p>
          <p 
          className='link overflow-dots text-red-500 hover:text-red-600'
          onClick={openDeleteAccountPopup}
          > 
          - delete new account
          </p>
        </div>
      </div>
      <div className='w-full flex justify-end'>
        <RefreshButton 
          className="mx-7 hover:bg-gray-200 transition-all rounded-full p-1"
          onClick={()=>{updateAllAccounts()}
        }/>
      </div>
      <AccountList/>
      <CreateAccountPopup isOpen={isCreateAccountPopupOpen} onClose={closeCreateAccountPopup} onSubmit={handleCreateAccountSubmit}/>
      <DeleteAccountPopup isOpen={isDeleteAccountPopupOpen} onClose={closeDeleteAccountPopup} onSubmit={handleDeleteAccountSubmit}/>
      <ResponsePopup isOpen={resounseIsOpen} error={error} response={response} onClose={closeResponsePopup}/>
      {isLoading ? 
      <LoadingSpinner/> :
      ''
      }
    </div>
  )
}

export default Accounts