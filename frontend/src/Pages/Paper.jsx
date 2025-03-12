import React, { useState } from 'react'
import Navbar from '../Components/Navbar'
import PaperConf from "../assets/Paper.jpeg"
import PaperSignup from '../Components/PaperSignup'
import PaperSignIn from '../Components/PaperSignin'

const Paper = () => {
    const [isSignupOpen, setIsSignupOpen] = useState(false);
    const [isSigninOpen, setIsSigninOpen] = useState(false);

    return (
        <>
            <Navbar />
            <section className="w-full flex gap-12 items-start justify-start py-36 px-8 bg-gray-100 openSans">
                <div className="w-[55vw] flex justify-center">
                    <div className="relative rounded-2xl overflow-hidden h-[60vh] w-full shadow-2xl shadow-blue-200 hover:shadow-blue-500 transition">
                        <img
                            src={PaperConf}
                            alt="Registration Preview"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                <div className="w-[40vw] flex flex-col items-start justify-start">
                    <h3 className="text-gray-500 font-semibold uppercase tracking-wide">
                        Publish Your Paper
                    </h3>
                    <h2 className="text-5xl font-bold text-blue-800 mt-2 leading-tight mb-2 moonDance">
                        Effortless Paper Submission & Review
                    </h2>
                    <p className="text-gray-600 leading-relaxed">
                        <b>ConferenceHub</b> simplifies the paper submission and review process, ensuring a seamless and efficient workflow for researchers and reviewers.
                    </p>
                    <ul className="list-disc pl-5 mt-2 text-gray-600">
                        <li>Enable easy submission of research papers with structured and customizable forms.</li>
                        <li>Assign reviewers automatically and track the review progress in real time.</li>
                        <li>Facilitate transparent communication between authors and reviewers for better feedback.</li>
                        <li>Streamline the approval process with automated notifications and status updates.</li>
                    </ul>

                    <button className="bg-gradient-to-r mt-6 from-blue-500 to-purple-600 hover:scale-105 transition-transform duration-300 shadow-lg text-white px-6 py-2 rounded-full font-semibold cursor-pointer" onClick={() => setIsSigninOpen(true)}>
                        Publish or Review Paper
                    </button>
                </div>
            </section>
            {isSignupOpen && <PaperSignup setIsSignupOpen={setIsSignupOpen} setIsSigninOpen={setIsSigninOpen} />}
            {isSigninOpen && <PaperSignIn setIsSignupOpen={setIsSignupOpen} setIsSigninOpen={setIsSigninOpen} />}
        </>
    )
}

export default Paper