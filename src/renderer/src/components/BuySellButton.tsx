import React, { ComponentProps, useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import BuyStockPopup from './BuyStockPopup';

const BuySellButton = ({className='', symbol}) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  const handleBuySubmit = (order) => {
    console.log('Order placed:', order); // Handle the order (e.g., send to backend)
  };

  const handleSellSubmit = (order) => {
    console.log('Order placed:', order); // Handle the order (e.g., send to backend)
  };

  useEffect(() => {setIsPopupOpen(false)}, [symbol])
  return (
  <div className={twMerge("mt-2 pb-2", className)}>
    <button 
    className="text-sm bg-blue-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-blue-600"
    onClick={openPopup}
    >
      Buy
    </button>
    <button className="text-sm bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
      Sell
    </button>

    <BuyStockPopup isOpen={isPopupOpen} onClose={closePopup} onSubmit={handleBuySubmit} symbol={symbol}/>
  </div>
  )
}

export default BuySellButton