import React, { ComponentProps, useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import BuyStockPopup from './popups/BuyStockPopup';
import SellStockPopup from './popups/SellStockPopup';
import ResponsePopup from './popups/ResponsePopup';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { accountDataAtom, selectedIndexAtom, updateAllAccountsAtom } from '@renderer/store';
import { AccountInfo } from '@shared/models';
import LoadingSpinner from './LoadingSpinner';

const BuySellButton = ({className='', symbol}) => {
  const updateAllAccounts = useSetAtom(updateAllAccountsAtom)
  const [isLoading, setIsLoading] = useState(false)

  // buy and sell button functionality
  const [isBuyPopupOpen, setIsBuyPopupOpen] = useState(false);
  const openBuyPopup = () => {
    if (acc==null) {
      setResponse({isOpen:true, error:true, response:"Please select an account before attempting to buy."})
      return
    }
    setIsBuyPopupOpen(true);
  }
  const closeBuyPopup = () => setIsBuyPopupOpen(false);
  const [isSellPopupOpen, setIsSellPopupOpen] = useState(false);
  const openSellPopup = () => {
    if (acc==null) {
      setResponse({isOpen:true, error:true, response:"Please select an account before attempting to buy."})
      return
    }
    setIsSellPopupOpen(true);
  }
  const closeSellPopup = () => setIsSellPopupOpen(false);

  //response functions
  const [{isOpen, error, response}, setResponse] = useState({
    isOpen: false,
    error: false,
    response: "",
  });
  const closeResponsePopup = () => setResponse({
    error, response,
    isOpen: false
  })
  //grab account
  const selectedIndex = useAtomValue(selectedIndexAtom)
  const [data, setData] = useAtom(accountDataAtom)

  let acc:AccountInfo|null;
  let currectShares=0 
  if (data == null || selectedIndex==null) {acc = null} 
    else {acc = data.accounts[selectedIndex] ;console.log(acc.name);
      for (const pos of acc.positions) {
          if (pos.symbol==symbol) {currectShares=pos.quantity; break}
      }
    }

  //handle buy and sell submisions
  const handleBuySubmit = (order) => {
    if (acc==null || data == null) {
      setResponse({isOpen:true, error:true, response:"Please select an account before attempting to buy."})
      return
    }
    setIsLoading(true)
    window.context.buyStock(acc.name, order.symbol, order.numShares)
    .then((newAccountData) => {
      if (typeof newAccountData === 'string') {
        setResponse({isOpen:true, error:true, response:newAccountData})
        setIsLoading(false)
        return
      }
      setData({
        ...data,
        accounts: newAccountData
      })
      updateAllAccounts()
      setIsLoading(false)
      setResponse({isOpen:true, error:false, response:`Bought ${order.numShares} shares of ${order.symbol}!`})
    })
  };

  const handleSellSubmit = (order) => {
    if (acc==null || data == null) {
      setResponse({isOpen:true, error:true, response:"Please select an account before attempting to buy."})
      return
    }
    setIsLoading(true)
    window.context.sellStock(acc.name, order.symbol, order.numShares)
    .then((newAccountData) => {
      if (typeof newAccountData === 'string') {
        setResponse({isOpen:true, error:true, response:newAccountData})
        setIsLoading(false)
        return
      }
      setData({
        ...data,
        accounts: newAccountData
      })
      updateAllAccounts()
      setIsLoading(false)
      setResponse({isOpen:true, error:false, response:`Sold ${order.numShares} shares of ${order.symbol}!`})
    })
  };


  useEffect(() => {closeBuyPopup(); closeSellPopup; closeResponsePopup()}, [symbol])
  return (
  <div className={twMerge("mt-2 pb-2", className)}>
    <button 
    className="text-sm bg-blue-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-blue-600"
    onClick={openBuyPopup}
    >
      Buy
    </button>
    <button 
    className="text-sm bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
    onClick={openSellPopup}
    >
      Sell
    </button>

    <BuyStockPopup isOpen={isBuyPopupOpen} onClose={closeBuyPopup} onSubmit={handleBuySubmit} symbol={symbol} accName={acc?.name} cashBalance={acc?.cashBalance}/>
    <SellStockPopup isOpen={isSellPopupOpen} onClose={closeSellPopup} onSubmit={handleSellSubmit} symbol={symbol} accName={acc?.name} currentShares={currectShares}/>
    <ResponsePopup isOpen={isOpen} error={error} response={response} onClose={closeResponsePopup}/>
    {isLoading ? 
      <LoadingSpinner/> :
      ''
    }
  </div>
  )
}

export default BuySellButton