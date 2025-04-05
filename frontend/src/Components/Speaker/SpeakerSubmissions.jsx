import React from 'react'
import Sidebar3 from './Sidebar3'

const SpeakerSubmissions = () => {
    return (
        <div className='w-full min-h-screen flex justify-end items-start openSans'>
            <Sidebar3 />

            <div className='w-4/5 min-h-screen flex flex-col p-6 bg-gray-100 overflow-y-auto'>
                <div className='w-full sticky top-0 right-0 z-50 bg-white p-6 shadow-lg'>
                    <h1 className="text-3xl font-bold mb-1 montserrat text-center">My Submissions</h1>
                    <p className='text-lg font-medium montserrat text-gray-500 text-center'>
                        Manage your research and conference paper submissions with ease — track status, upload final versions, and get ready to publish your work post-conference!
                    </p>
                </div>
            </div>
        </div>
    )
}

export default SpeakerSubmissions