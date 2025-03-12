import React, { useState } from 'react'
import Navbar from '../Components/Navbar'
import CreateCon from "../assets/CreateConf.avif"
import OrganiserSignup from '../Components/OrganiserSignup'
import OrganiserSignin from '../Components/OrganiserSignin'

const CreateConf = () => {
    const [isSignupOpen, setIsSignupOpen] = useState(false);
    const [isSigninOpen, setIsSigninOpen] = useState(false);

    return (
        <>
            <Navbar />
            <section className="w-full flex gap-12 items-start justify-start py-32 px-8 bg-gray-100 openSans">
                <div className="w-[40vw] flex flex-col items-start justify-start">
                    <h3 className="text-gray-500 font-semibold uppercase tracking-wide">
                        Create Your Conference
                    </h3>
                    <h2 className="text-5xl font-bold text-blue-800 mt-2 leading-tight mb-4 moonDance">
                        Seamless Session & Event Registration
                    </h2>
                    <p className="text-gray-600 leading-relaxed">
                        <b>ConferenceHub</b> streamlines the creation and management of conference sessions, workshops, and presentations with an intuitive and efficient workflow.
                    </p>
                    <ul className="list-disc pl-5 mt-2 text-gray-600">
                        <li>Effortlessly create and schedule sessions, ensuring smooth event coordination.</li>
                        <li>Assign speakers and moderators with automated notifications and reminders.</li>
                        <li>Avoid scheduling conflicts with real-time session management and updates.</li>
                        <li>Enhance attendee engagement with clear session details and instant notifications.</li>
                    </ul>


                    <button className="bg-gradient-to-r mt-6 from-blue-500 to-purple-600 hover:scale-105 transition-transform duration-300 shadow-lg text-white px-6 py-2 rounded-full font-semibold cursor-pointer" onClick={() => setIsSigninOpen(true)}>
                        Create Your Conference
                    </button>
                </div>

                <div className="w-[55vw] flex justify-center">
                    <div className="relative rounded-2xl overflow-hidden h-[60vh] w-full shadow-2xl shadow-blue-200 hover:shadow-blue-500 transition">
                        <img
                            src={CreateCon}
                            alt="Registration Preview"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </section>
            {isSignupOpen && <OrganiserSignup setIsSignupOpen={setIsSignupOpen} setIsSigninOpen={setIsSigninOpen} />}
            {isSigninOpen && <OrganiserSignin setIsSignupOpen={setIsSignupOpen} setIsSigninOpen={setIsSigninOpen} />}
        </>
    )
}

export default CreateConf