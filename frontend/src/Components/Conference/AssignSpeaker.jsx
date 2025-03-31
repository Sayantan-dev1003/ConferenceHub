import React from 'react'
import Sidebar1 from './Sidebar1'

const AssignSpeaker = () => {
    return (
        <div className='w-full min-h-screen flex justify-end items-start openSans'>
            <Sidebar1 />
            <div className='w-4/5 min-h-screen flex flex-col overflow-y-auto p-6'>
                <h1 className="text-3xl font-bold mb-1 montserrat text-center">Assign Speaker</h1>
                <p className='text-lg font-medium montserrat text-gray-500 text-center'>Seamlessly manage speaker assignments, track participation, and boost engagement with intuitive and efficient tools!</p>
            </div>
            
        </div>
    )
}

export default AssignSpeaker