import React, { useState } from 'react'
import Navbar from '../Components/Navbar'
import PaperConf from "../assets/Paper.jpeg"
import ReviewerSignup from '../Components/ReviewerSignup';
import ReviewerSignin from '../Components/ReviewerSignin'; useState

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
                        Browse Conference Papers
                    </h3>
                    <h2 className="text-5xl font-bold text-blue-800 mt-2 leading-tight mb-2 moonDance">
                        Empowering Publication Through Expert Reviews
                    </h2>
                    <p className="text-gray-600 leading-relaxed">
                        <b>Reviewers</b> play a vital role in maintaining the quality and integrity of the research shared on <b>ConferenceHub</b>.
                    </p>
                    <ul className="text-gray-600 leading-relaxed mt-4 list-disc list-inside">
                        <li>Assigned by organizers, reviewers are responsible for evaluating submitted conference papers based on originality, relevance, and technical accuracy.</li>
                        <li>Their expert recommendations and constructive feedback help determine whether a paper is ready for publication.</li>
                        <li>This transparent review process ensures only high-quality, peer-reviewed content is made available to the community.</li>
                    </ul>

                    <button className="bg-gradient-to-r mt-6 from-blue-500 to-purple-600 hover:scale-105 transition-transform duration-300 shadow-lg text-white px-6 py-2 rounded-full font-semibold cursor-pointer" onClick={() => setIsSigninOpen(true)}>
                        Browse Conference Papers
                    </button>
                </div>
            </section>
            {isSignupOpen && <ReviewerSignup setIsSignupOpen={setIsSignupOpen} setIsSigninOpen={setIsSigninOpen} />}
            {isSigninOpen && <ReviewerSignin setIsSignupOpen={setIsSignupOpen} setIsSigninOpen={setIsSigninOpen} />}
        </>
    )
}

export default Paper