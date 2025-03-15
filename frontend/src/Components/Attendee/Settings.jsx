import React from 'react'
import Sidebar2 from "./Sidebar2"

const Settings = () => {
  return (
    <div className='w-full min-h-screen flex justify-end items-start openSans'>
        <Sidebar2 />
        <div className='w-4/5 min-h-screen flex flex-col overflow-y-auto'>
            This is Settings Page.
        </div>
    </div>
  )
}

export default Settings