import React from 'react'
import Sidebar1 from '../Components/Conference/Sidebar1'

const ConferenceDashboard = () => {
  return (
    <>
      <div className='w-full min-h-screen flex'>
        <Sidebar1 />
        <div className='w-4/5'>This is Conference dashboard</div>
      </div>
    </>
  )
}

export default ConferenceDashboard