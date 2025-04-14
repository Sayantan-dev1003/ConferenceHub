import React from 'react'
import Sidebar4 from './SideBar4'

const ReviewHistory = () => {
  return (
    <div className='w-full min-h-screen flex justify-end items-start openSans'>
      <Sidebar4 />
      <div className='w-4/5 min-h-screen flex flex-col p-6 bg-gray-100 overflow-y-auto'>
        <div className='bg-white p-6 rounded-lg shadow-lg mb-6'>
          <p className="text-gray-500 text-sm mt-1">Review History</p></div>
        </div>
    </div>
  )
}

export default ReviewHistory