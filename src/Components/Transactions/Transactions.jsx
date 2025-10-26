import React from 'react'

const Transactions = () => {
  return (
    <div className="flex flex-col w-full max-w-[550px] h-350 max-h-[350px] border border-none rounded-lg bg-gradient-to-r from-black via-gray-800 to-green-800 shadow-2xl shadow-green-900">
      <div className="flex items-center justify-between p-3">
        <p className="text-white text-xl">Transactions</p>
        <div className="flex text-white items-center">
          <p className="hover:bg-green-800 px-2 py-1 rounded-lg cursor-pointer text-2xl">+</p>

        </div>
      </div>
      <div className='flex items-center justify-center border border-box border-none h-4 bg-green-700 p-3'>
        <p className='text-white'>
          Today, 12/04/2025
        </p>
        <span className="text-white ml-2 cursor-pointer">&#9660;</span>

      </div>
      <div className='flex items-center h-16 w-full p-3'>
        <div className='h-16 w-full'>
          <li className='text-white flex items-center justify-between w-full'>
            <p className="m-0">Reminder 1</p>
            <span className="cursor-pointer">$ 2000</span>
          </li>

          <li className='text-white flex items-center justify-between'>
            Reminder 2
            <span className="cursor-pointer">$ 2000</span>
          </li>
        </div>
      </div>
      <div className='flex items-center justify-center border border-box border-none h-4 bg-green-700 p-3'>
        <p className='text-white'>
          Tommorow, 13/04/2025
        </p>
        <span className="text-white ml-2 cursor-pointer">&#9660;</span>

      </div>
      <div className='flex items-center h-16 w-full p-3'>
        <div className='h-16 w-full'>
          <li className='text-white flex items-center justify-between w-full'>
            <p className="m-0">Reminder 1</p>
            <span className="cursor-pointer">$ 2000</span>
          </li>

          <li className='text-white flex items-center justify-between'>
            Reminder 2
            <span className="cursor-pointer">$ 2000</span>
          </li>
        </div>
      </div>




      <div className='flex items-center justify-center border border-box border-none h-4 bg-green-700 p-3'>
        <p className='text-white'>
          Later
        </p>
        <span className="text-white ml-2 cursor-pointer">&#9660;</span>

      </div>
      <div className='flex items-center h-16 w-full p-3'>
        <div className='h-16 w-full'>
          <li className='text-white flex items-center justify-between w-full'>
            <p className="m-0">Reminder 1</p>
            <span className="cursor-pointer">$ 2000</span>
          </li>

          <li className='text-white flex items-center justify-between'>
            Reminder 2
            <span className="cursor-pointer">$ 2000</span>
          </li>
        </div>
      </div>
    </div>
  )
}

export default Transactions
