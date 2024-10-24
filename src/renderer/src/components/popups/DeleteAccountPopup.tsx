import React, { useState } from 'react'

const DeleteAccountPopup = ({isOpen, onSubmit, onClose}) => {

  const [accountName, setAccountName] = useState("")

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit the order
    onSubmit(accountName);
    onClose()
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">

        <div className="bg-white rounded-lg p-4 w-96 relative">
          <button
            onClick={onClose}
            className="w-8 h-8 absolute top-2 right-2 font-bold text-2xl rounded text-red-700"
          >
            &times;
          </button>

          <h2 className="text-xl font-semibold mb-4">Delete Account</h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Account Name
              </label>
              <input
                type="text"
                id="name"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter Your Name"
                required
              />
            </div>

            <button
            type="submit"
            className="w-full bg-blue-600 text-white rounded-md p-2 hover:bg-red-500 h-10"
            >
              Delete Account!
            </button>

          </form>
        </div>
    </div>
  )
}

export default DeleteAccountPopup