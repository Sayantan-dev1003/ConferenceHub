import React from 'react'
import Sidebar3 from './Sidebar3'

const PublishPaper = () => {
    return (
        <div className='w-full min-h-screen flex justify-end items-start openSans'>
            <Sidebar3 />

            <div className='w-4/5 min-h-screen flex flex-col p-6 bg-gray-100 overflow-y-auto'>
                <div className='w-full sticky top-0 right-0 z-50 bg-white p-6 shadow-lg'>
                    <h1 className="text-3xl font-bold mb-1 montserrat text-center">Publish Your Paper</h1>
                    <p className='text-lg font-medium montserrat text-gray-500 text-center'>
                        Upload and publish your final research or conference paper to share your knowledge with the world — accessible to a wider audience beyond the conference!
                    </p>

                </div>
            </div>
        </div>
    )
}

export default PublishPaper