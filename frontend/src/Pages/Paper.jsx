import React from 'react'
import Navbar from '../Components/Navbar'
import PaperConf from "../assets/Paper.jpeg"
import { useNavigate } from 'react-router-dom'

const Paper = () => {
    const navigate = useNavigate();

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
                        Open Access to Research, Anytime, Anywhere
                    </h2>
                    <p className="text-gray-600 leading-relaxed">
                        <b>ConferenceHub</b> makes exploring research papers effortless for everyone — whether you're an attendee, researcher, or simply curious.
                    </p>
                    <ul className="list-disc pl-5 mt-2 text-gray-600">
                        <li>Browse a growing archive of conference papers using powerful filters and search tools by title, topic, author, or conference name.</li>
                        <li>Read and download high-quality papers in one click</li>
                        <li>Explore cutting-edge research from experts across fields and conferences.</li>
                        <li>Leave feedback, save favorites, or rate papers if signed in — enhancing interaction and recognition for authors.</li>
                    </ul>

                    <button className="bg-gradient-to-r mt-6 from-blue-500 to-purple-600 hover:scale-105 transition-transform duration-300 shadow-lg text-white px-6 py-2 rounded-full font-semibold cursor-pointer" onClick={() => navigate("/paper-archives")}>
                        Browse Conference Papers
                    </button>
                </div>
            </section>
        </>
    )
}

export default Paper