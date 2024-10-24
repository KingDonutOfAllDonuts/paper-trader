import React from 'react'

const ResponsePopup = ({isOpen, error, response, onClose}) => {

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">

        <div className="bg-white rounded-lg p-4 w-96 relative">
          <button
            onClick={onClose}
            className="w-8 h-8 absolute top-2 right-2 font-bold text-2xl rounded text-red-700"
          >
            &times;
          </button>

          {error ?
           <h1 className='text-center w-full text-xl text-red-500 mb-2'>ERROR</h1>
           :  <h1 className='text-center w-full text-xl text-green-500'>Great!</h1>}
          <p className='text-sm text-center w-full'>{response}</p>

          <button className='text-xl bg-blue-500 hover:bg-blue-600 p-1 mt-2 text-white rounded w-full' onClick={onClose}>OK</button>
        </div>
    </div>
  )
}

export default ResponsePopup