import { formatNumber, getCurrentStockPrice, getPositionHistory } from '@shared/utils';
import React, { useEffect, useState } from 'react';
import LoadingSpinner from './LoadingSpinner';

const BuyStockPopup = ({ onSubmit, isOpen, symbol, onClose }) => {
  const [numShares, setNumShares] = useState(1);
  const [stockPrice, setStockPrice] = useState<number>(-1)
  // Calculate total cost
  const totalCost = numShares*stockPrice;

  useEffect(() => {
    if (!symbol) {return}
    getPositionHistory(symbol, "1d")
      .then((fetchedHistory) => {
        setStockPrice(getCurrentStockPrice(null, fetchedHistory.metaData)); // Update state with fetched history
      })
      .catch((error) => {
        console.error('Error fetching history:', error);
      });
  }, [symbol])
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit the order
    onSubmit({ symbol, numShares, totalCost });
    onClose()
  };

  if (!isOpen) return null; // Don't render the popup if it's not open

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-96 relative">
        <button
          onClick={onClose}
          className="w-8 h-8 absolute top-2 right-2 font-bold text-2xl rounded text-red-700"
        >
          &times;
        </button>

        <h2 className="text-xl font-semibold mb-4">Buy Stock</h2>

        {/* Stock purchase form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Stock Symbol
            </label>
            <h2 className='text-lg'>{symbol}</h2>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Current Price 
            </label>
            <h2 className='text-lg'>{stockPrice == -1 ?  'Loading...': formatNumber(stockPrice)}</h2>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Number of Shares
            </label>
            <input
              type="number"
              id="shares"
              value={numShares}
              onChange={(e) => setNumShares(parseInt(e.target.value))}
              min="1"
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <p className="text-sm font-medium">Estimated Cost: {formatNumber(totalCost)}</p>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white rounded-md p-2 hover:bg-blue-700"
          >
            Place Order
          </button>
        </form>
      </div>
      {stockPrice == -1 ? <LoadingSpinner/> : ''}
    </div>
  );
};

export default BuyStockPopup