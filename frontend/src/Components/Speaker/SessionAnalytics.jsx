import React from 'react'
import Sidebar3 from "./Sidebar3";

const SessionAnalytics = () => {
  return (
    <div className='w-full min-h-screen flex justify-end items-start openSans'>
      <Sidebar3 />

      <div className='w-4/5 min-h-screen flex flex-col p-6 bg-gray-100 overflow-y-auto'>
        <p>This is Speaker's Session Analytics</p>
      </div>
    </div>
  )
}

export default SessionAnalytics